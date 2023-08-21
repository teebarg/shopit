import sys
import os
import boto3
import json
from datetime import datetime
import dateutil.parser
import pytz
import gc
sys.path.append('../../lib')
from dataviz.redshift_functions import batch_redshift_export, create_jsonpath, build_create_statement, build_copy_statement, redshift_create_table, redshift_copy_into

import logging
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info(f"\n\nRunning Python Version {sys.version}\n\n")

dryRun = os.environ.get('DRY_RUN', "True")
dryRun = False if dryRun == "False" else True

createTables = os.environ.get('CREATE_TABLES', "False")
createTables = False if createTables == 'False' else True

copyIntoTables = os.environ.get('COPY_INTO_TABLES', "False")
copyIntoTables = False if copyIntoTables == 'False' else True

deleteFrom = os.environ.get('DELETE_FROM', "False")
deleteFrom = False if deleteFrom == 'False' else True

pullHubspot = os.environ.get('PULL_HUBSPOT', "False")
pullHubspot = False if pullHubspot == 'False' else True

pullGigwage =  os.environ.get('PULL_GIGWAGE', "False")
pullGigwage = False if pullGigwage == 'False' else True

allTables = os.environ.get('ALL_TABLES', "True")
allTables = False if allTables == 'False' else True

selectTables = os.environ.get('SELECT_TABLES', None)
selectTables = selectTables.split(',') if selectTables else []

s3_bucket = os.environ.get('S3_BUCKET')
s3 = boto3.client('s3')
subdir_red = 'redshift'
run_partition = datetime.utcnow().replace(microsecond=0).astimezone(pytz.timezone('UTC')).strftime('%Y%m%dT%H%M%S')

logging.info(f'Starting ETL For BI Tool: Dry-Run = {dryRun}, Bucket = {s3_bucket}, createTables = {createTables}, copyIntoTables = {copyIntoTables}, deleteFrom = {deleteFrom}, allTables = {allTables}, selectTables = {selectTables}, pullHubspot = {pullHubspot}, pullGigwage = {pullGigwage}  ...')
ts_start = datetime.now()
runtime_hour = int(datetime.utcnow().strftime('%H'))

import traceback
def catch_traceback(data_func, select_as):
    """Wrapper allows program to keep running while logging data quality issue for a given export func"""
    try:
        dataset = data_func()
    except Exception:
        logging.error(f'Problem with {select_as} table: \n {traceback.format_exc()} \n Could not complete {select_as} ETL ...  Moving on ...')
        dataset = []
    return dataset

def ETL(data_object, use_catch=True, redshift=True):
    """Kicks off ETL for each tool/location, then deletes from memory. Add funcs for new tools/locations here."""
    if allTables==True or data_object.get('select_as') in selectTables:
        if use_catch==True:
            dataset = catch_traceback(data_object.get('export_func'), data_object.get('select_as'))
        else:
            dataset = data_object.get('export_func')
        if len(dataset)>0:
            logging.info(f"Exporting {data_object.get('select_as')},  Redshift = {redshift} ...")
            if redshift:
                redshiftETL(dataset=dataset, data_object=data_object)
            del dataset
            gc.collect()
        else:
            del dataset
            del data_object
            gc.collect()

def redshiftETL(dataset, data_object):
    """ Redshift Process:
        - Creates a jsonpath file that contains the schema of the corresponding dataset, saves to S3
        - Saves the dataset in batches of json files in S3
            - Batch sizes are set to incr=2000 by default, this can be adjusted
        - (In Production) Deletes from the table, then Copies into the table with the newly written S3 files
        - (For a new table - pre-deploy step) Creates a new table then Copies into the table with the newly written S3 files
    - dryRun=True: will just print the length of the dataset, and will not connect to Redshift
    """
    redshift_table = data_object.get('redshift_table')
    if dryRun:
        logging.info(f"{redshift_table}: {len(dataset)}")
    else:
        redshift_folder = data_object.get('redshift_folder')
        jsonpaths, schemas, col_names = create_jsonpath(dataset, data_object)

        s3.put_object(
                    Body=json.dumps(jsonpaths), Bucket=s3_bucket, Key=f"{subdir_red}/{redshift_folder}/{redshift_table}_jsonpath.json"
                )
        logging.info(f"REDSHIFT JSONPATH Updated s3://{s3_bucket}/{subdir_red}/{redshift_folder}/{redshift_table}_jsonpath.json")

        files_red = batch_redshift_export(data=dataset,name=redshift_table,run_partition=run_partition,incr=2000)
        for file_red in files_red:
            s3.put_object(
              Body=open(file_red, 'rb')
                 ,Bucket=s3_bucket
                 ,Key=f"{subdir_red}/{redshift_folder}/{redshift_table}/{run_partition}/{file_red}"
            )
            os.remove(file_red)
            logging.info(f"REDSHIFT FILE Updated s3://{s3_bucket}/{subdir_red}/{redshift_folder}/{redshift_table}/{run_partition}/{file_red}")

        if createTables:
            redshift_create_table(table_query=build_create_statement(tbl=redshift_table, scm=schemas), table_name=redshift_table)

        if copyIntoTables:
            redshift_copy_into(
                copy_query=build_copy_statement(tbl=redshift_table, cols=col_names
                                                            , file_path=f"{s3_bucket}/{subdir_red}/{redshift_folder}/{redshift_table}/{run_partition}"
                                                            , file_jsonpath=f"{s3_bucket}/{subdir_red}/{redshift_folder}/{redshift_table}_jsonpath")
                , table_name=redshift_table, deleteFrom=deleteFrom)

"""
Runs for each dataset below if ALL_TABLES = True, else -- enter the "select_as" value with SELECT_TABLES variable for run

"""

from dataviz.member_dump import export_members
members = {'select_as': 'members'
    , 'export_func': export_members
    , 'redshift_table': 'member_attributes'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['JOINED', 'surveyCompleted', 'Member Profile Last Updated', 'one_time_update']\
               , 'timestamps':['JOINED DATETIME', 'Member Profile Last Update Timestamp', 'RUNTIME', 'one_time_update_utc', 'last_profile_imported_utc']\
               , 'name_changes':{'RACE/ETHNICITY':'race_ethnicity'}}
    }
ETL(data_object=members)

from dataviz.marketplace_actions import export_meta
meta_engagement_records = {'select_as': 'meta_engagement_records'
    , 'export_func': export_meta
    , 'redshift_table': 'meta_engagement_records'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['engagement_last_updated_dt', 'match_creation_dt', 'slate_active', 'slate_closed', 'activated_dt', 'start_dt']\
             , 'timestamps': ['RUNTIME','slate_closed_utc', 'activated_utc', 'start_utc', 'engagement_last_updated', 'engagement_last_updated_utc', 'match_creation', 'match_creation_utc', 'slate_active_utc', 'NoCandidates_reminder', 'NoContactedCandidates_reminder','NoOffersSent_reminder']\
             , 'name_changes':{'match_id':'engagement_id'}}
    }
ETL(data_object=meta_engagement_records)

from dataviz.marketplace_actions import export_member_edge
export_member_edge = {'select_as': 'member_edge_engagements'
    , 'export_func': export_member_edge
    , 'redshift_table': 'member_edge_engagements'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['G1_dt', 'contact_dt', 'contact_hire_dt', 'interested_dt', 'hired_dt', 'engage_start_dt', 'engage_end_dt', 'viewed_dt']\
              , 'timestamps': ['G1_utc', 'contact_utc', 'contact_hire_utc', 'interested_utc', 'hired_utc', 'engage_start_utc', 'engage_end_utc', 'RUNTIME', 'viewed_utc', 'reminder_one_utc', 'reminder_two_utc', 'reminder_three_utc','candidate_last_activity_dt','candidate_added_dt']\
              , 'name_changes':{'match_id':'engagement_id'}}
    }
ETL(data_object=export_member_edge)

from dataviz.marketplace_actions import export_bbites
bbite_requests = {'select_as': 'bbite_requests'
    , 'export_func': export_bbites
    , 'redshift_table': 'bbite_requests'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['created_dt'], 'timestamps':['created', 'created_utc', 'RUNTIME']}
    }
ETL(data_object=bbite_requests)

from dataviz.badge_tags import export_badged_flat
badged_accounts = {'select_as': 'badged_accounts'
    , 'export_func': export_badged_flat
    , 'redshift_table': 'badged_accounts'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                , 'timestamps': ['runtime']}
    }
ETL(data_object=badged_accounts)

from dataviz.badge_tags import export_tag_list
badge_master_list = {'select_as': 'badge_master_list'
    , 'export_func': export_tag_list
    , 'redshift_table': 'badge_master_list'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                , 'timestamps': ['runtime']}
    }
ETL(data_object=badge_master_list)

from dataviz.clients_and_companies import companies_export
companies = {'select_as': 'companies'
    , 'export_func': companies_export
    , 'redshift_table': 'companies_attributes'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                   , 'timestamps': ['RUNTIME']}
    }
ETL(data_object=companies)

from dataviz.clients_and_companies import client_company_map
client_company = {'select_as': 'client_company_map'
    , 'export_func': client_company_map
    , 'redshift_table': 'client_company_map'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                        , 'timestamps': ['RUNTIME']}
    }
ETL(data_object=client_company)

from dataviz.partners_dump import partners_export
partners = {'select_as': 'partners'
    , 'export_func': partners_export
    , 'redshift_table': 'partner_attributes'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['Partner Joined Date']\
                  , 'timestamps': ['RUNTIME', 'Partner Joined Timestamp']}
    }
ETL(data_object=partners)

from dataviz.clients_and_companies import clients_export
clients = {'select_as': 'clients'
    , 'export_func': clients_export
    , 'redshift_table': 'client_attributes'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['Client Joined Date']\
                 , 'timestamps': ['RUNTIME', 'Client Joined Timestamp']}
    }
ETL(data_object=clients)

from dataviz.marketplace_actions import export_member_opp_feed
member_opp_feed = {'select_as': 'member_opp_feed'
    , 'export_func': export_member_opp_feed
    , 'redshift_table': 'member_opportunity_feed'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                 , 'timestamps': ['opportunity_added_dt', 'runtime']}
    }
ETL(data_object=member_opp_feed)

from dataviz.marketplace_actions import export_opp_feed_edge_records
member_opp_edge_records = {'select_as': 'member_opp_edge_records'
    , 'export_func': export_opp_feed_edge_records
    , 'redshift_table': 'member_opp_edge_records'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[]\
                 , 'timestamps': ['expressed_interest_dt', 'reviewed_dt', 'runtime']}
    }
ETL(data_object=member_opp_edge_records)


from dataviz.marketplace_actions import export_watchings
watchings = {'select_as': 'watchings'
    , 'export_func': export_watchings
    , 'redshift_table': 'watchings'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['watching_datetime', 'runtime']}
    }
ETL(data_object=watchings)

from dataviz.marketplace_actions import export_collab_links
collab_links = {'select_as': 'collab_links'
    , 'export_func': export_collab_links
    , 'redshift_table': 'collab_links'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['link_datetime', 'runtime']}
    }
ETL(data_object=collab_links)

from dataviz.marketplace_actions import export_admin_invites
admin_invites = {'select_as': 'admin_invites'
    , 'export_func': export_admin_invites
    , 'redshift_table': 'admin_invites'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['invite_datetime', 'runtime']}
    }
ETL(data_object=admin_invites)

from dataviz.marketplace_actions import export_sysinvites
sysinvites = {'select_as': 'sysinvites'
    , 'export_func': export_sysinvites
    , 'redshift_table': 'sysinvites'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':['start_dt'], 'timestamps': ['invite_datetime', 'runtime']}
    }
ETL(data_object=sysinvites)

from dataviz.marketplace_actions import export_search_sessions
search_sessions = {'select_as': 'search_sessions'
    , 'export_func': export_search_sessions
    , 'redshift_table': 'search_sessions'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['session_timestamp', 'search_timestamp', 'runtime']}
    }
ETL(data_object=search_sessions)

from dataviz.marketplace_actions import export_dwell_metrics
dwell_metrics = {'select_as': 'dwell_metrics'
    , 'export_func': export_dwell_metrics
    , 'redshift_table': 'dwell_metrics'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates': ['dwell_date'], 'timestamps': ['runtime']}
    }
ETL(data_object=dwell_metrics)

from dataviz.marketplace_actions import export_meta_engagement_audits
meta_engagement_audits = {'select_as': 'meta_engagement_audits'
    , 'export_func': export_meta_engagement_audits
    , 'redshift_table': 'meta_engagement_audits'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['status_datetime', 'previous_status_datetime', 'runtime']}
    }
ETL(data_object=meta_engagement_audits)

from dataviz.marketplace_actions import export_member_edge_audits
member_edge_audits = {'select_as': 'member_edge_audits'
    , 'export_func': export_member_edge_audits
    , 'redshift_table': 'member_edge_audits'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['status_datetime', 'previous_status_datetime', 'runtime']}
    }
ETL(data_object=member_edge_audits)

from dataviz.marketplace_actions import  export_in_app_messages
in_app_messages = {'select_as': 'in_app_messages'
    , 'export_func': export_in_app_messages
    , 'redshift_table': 'in_app_messages'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['message_datetime', 'runtime']}
    }
ETL(data_object=in_app_messages)

from dataviz.marketplace_actions import  export_email_audits
email_audits = {'select_as': 'email_audits'
    , 'export_func': export_email_audits
    , 'redshift_table': 'email_audits'
    , 'redshift_folder': 'marketplace'
    , 'redshift_schemas': {'dates':[], 'timestamps': ['email_action_datetime', 'send_datetime', 'delivery_datetime', 'open_datetime', 'click_datetime', 'candidate_tab_click_datetime', 'call_to_action_datetime', 'notification_settings_datetime', 'view_opportunity_link_datetime', 'runtime']}
    }
ETL(data_object=email_audits)

if pullHubspot:
    if runtime_hour <=1 or runtime_hour >=18:
        from dataviz.hubspot_data import hs_get_deal_page, hs_get_company_page, hs_get_contact_page, export_hubspot_properties
        hubspot_deals = {'select_as': 'hubspot_deals'
          , 'export_func': export_hubspot_properties(hs_get_deal_page(0,[]))
          , 'redshift_table': 'hubspot_deals'
          , 'redshift_folder': 'hubspot'
          , 'redshift_schemas': {'dates':['closedate', 'createdate', 'hs_lastmodifieddate']\
                     , 'timestamps': ['createdat', 'updatedat']}
          }
        ETL(data_object=hubspot_deals, use_catch=False)

        hubspot_companies = {'select_as': 'hubspot_companies'
          , 'export_func': export_hubspot_properties(hs_get_company_page(0,[]))
          , 'redshift_table': 'hubspot_companies'
          , 'redshift_folder': 'hubspot'
          , 'redshift_schemas': {'dates':['bp___mentor_match_date', 'accelerator_graduation_date', 'pp___engagement_classification_types_timestamp']\
                     , 'timestamps': ['hs_lastmodifieddate','createdate', 'closedate','first_contact_createdate','first_deal_created_date','hs_createdate'\
                     ,'notes_last_contacted', 'notes_last_updated', 'createdat', 'updatedat']}
          }
        ETL(data_object=hubspot_companies, use_catch=False)

        hubspot_contacts = {'select_as': 'hubspot_contacts'
          , 'export_func': export_hubspot_properties(hs_get_contact_page(0,[]))
          , 'redshift_table': 'hubspot_contacts'
          , 'redshift_folder': 'hubspot'
          , 'redshift_schemas': {'dates':['bp___early_stage_startups_form_submitted', 'bp___prime_app_submitted_date' ]\
                     , 'timestamps': ['lastmodifieddate','createdate', 'closedate','engagements_last_meeting_booked'\
                     ,'hs_last_sales_activity_timestamp', 'hs_lifecyclestage_customer_date' ,'hs_lifecyclestage_lead_date', 'hs_lifecyclestage_opportunity_date'\
                     , 'hs_lifecyclestage_other_date', 'hs_lifecyclestage_subscriber_date', 'hubspot_owner_assigneddate','recent_deal_close_date'\
                     ,'hs_createdate','notes_last_contacted', 'notes_last_updated', 'createdat', 'updatedat']}
          }
        ETL(data_object=hubspot_contacts, use_catch=False)

if pullGigwage:
    if runtime_hour <=1 or runtime_hour >=18:
        from gigwage.gigwage import GigWageClient
        gig_wage_client = GigWageClient(publishable_key=os.environ.get('GIG_WAGE_PUBLISHABLE_KEY'), current_env=os.environ.get('CURRENT_ENV'), default_timeout=os.environ.get('GIG_DEFAULT_TIMEOUT'))
        gigwage_payments = {'select_as': 'gigwage_payments'
          , 'export_func': gig_wage_client.format_payments_list()
          , 'redshift_table': 'gigwage_payments'
          , 'redshift_folder': 'gigwage'
          , 'redshift_schemas': {'dates':['started', 'completed']\
                     , 'timestamps': ['runtime']}
          }
        ETL(data_object=gigwage_payments, use_catch=False)

logging.info("Completed Run Time: %s seconds", (datetime.now() - ts_start).total_seconds())
