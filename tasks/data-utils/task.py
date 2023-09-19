import sys
import os
import boto3
import json
from datetime import datetime
import dateutil.parser
import pytz
import gc
sys.path.append('../../lib')
from dataviz.redshift_functions import redshift_insert_into, redshift_get_table_counts, redshift_select

import logging
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

dryRun = os.environ.get('DRY_RUN', "True")
dryRun = False if dryRun == "False" else True

def run_utils(data_object, dryRun=dryRun):
    if dryRun:
        logging.info(f"{data_object.get('dryRun_log')}")
    else:
        redshift_insert_into(
            insert_query=data_object.get('query')
            , table_name=data_object.get('table_name')
            )
logging.info(f"\n\nRunning Python Version {sys.version}\n\n")
logging.info(f'Starting DATA-UTILS: Dry-Run = {dryRun}  ...')
ts_start = datetime.now()

daily_report_counts = {
    'dryRun_log': "SELECT * FROM todays_report_counts"
    , 'query': f"""INSERT INTO daily_report_counts (SELECT * FROM todays_report_counts)"""
    , 'table_name': 'daily_report_counts'
}
run_utils(data_object=daily_report_counts)

logging.info("Completed Run Time: %s seconds", (datetime.now() - ts_start).total_seconds())
