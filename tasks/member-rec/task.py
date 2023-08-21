import os
import sys
import time
from datetime import datetime
from joblib import Parallel, delayed
from itertools import islice
import boto3
import json
import pandas as pd
sys.path.append('../../lib')
from dydb import bolsters_db
from keywords.profile_functions import reduce_member_list, update_profile_cleanText, run_processor, profile_strings
from formatters.profile_utils import skills_map
from similarity.post_processing import intermediate_build, enrich_PDL, save_feature_vectors, load_feature_matrix, save_index_maps
from similarity.pdl_s3_import import pdl_read_s3_single, pdl_read_s3, combine_pdl_data, pdl_feats, weighted_pdl_feats
from similarity.similarity_funcs import original_features, combine_scores, generate_nn_map
from similarity.performance_tests import run_performance_metrics
import pickle

import logging
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info(f"\n\nRunning Python Version {sys.version}\n\n")

dryRun = os.environ.get('DRY_RUN', "True")
dryRun = False if dryRun == "False" else True

dryExport = os.environ.get('DRY_EXPORT', "True")
dryExport = False if dryExport == "False" else True

s3_bucket = os.environ.get('S3_BUCKET')
s3 = boto3.client('s3')
region = boto3.Session().region_name
s3b = boto3.Session().resource('s3', region_name=region)

oneTimeRun = os.environ.get('ONE_TIME_RUN')
oneTimeRun = False if oneTimeRun == "False" else True

forceSimilarity = os.environ.get('FORCE_SIMILARITY')
forceSimilarity = False if forceSimilarity == "False" else True

njobs = os.environ.get('JOBS')
njobs = int(njobs)
chunk_size = os.environ.get('CHUNKS')
chunk_size = int(chunk_size)

def chunks(data, SIZE):
    it = iter(data)
    for i in range(0, len(data), SIZE):
        yield {k:data[k] for k in islice(it, SIZE)}

def flatten(list_of_lists):
    return {item:v for sublist in list_of_lists for item,v in sublist.items()}

ts = f"{datetime.utcnow().replace(microsecond=0).isoformat()}Z"
runt = datetime.now().strftime('%Y%m%d_%H-%M-%S')

feature_matrix_dir = "member-rec/feature_matrix"
post_process_dir = "member-rec/processed_pk_list"
subdir = "member-rec/"+datetime.now().strftime('%Y%m%d')+"/"
bid_to_index_file = 'run_metadata_{}.json'.format(runt)

def run_similarity():
    logging.info(f'Starting Similarity Calculations: Dry-Run = {dryRun} ...')

    sim_features = original_features+['industry_most_relevant', 'skills']+weighted_pdl_feats

    everyone_enrich = load_feature_matrix(s3_bucket=s3_bucket, feature_matrix_dir=feature_matrix_dir+"/")
    runmeta = save_index_maps(data_matrix=everyone_enrich, ts=ts)

    seq_series = pd.Series(everyone_enrich['Seq'], index=everyone_enrich.index)
    all_uniques, all_cosines = combine_scores(data=everyone_enrich,feature_list=sim_features)
    matrices = all_cosines+all_uniques

    nn_map_file = 'len_{}_recmap_{}.ann'.format(len(matrices),runt)
    generate_nn_map(data_matrix=matrices, seq_series=seq_series,runt=runt, ntrees=100, formula='angular')

    if dryRun:
        run_performance_metrics(cur_matrices=matrices, cur_all_cosines=all_cosines, cur_all_uniques=all_uniques, len_current_feats=len(sim_features))
    else:
        s3.put_object(
             Body=json.dumps(runmeta)
             ,Bucket=s3_bucket
             ,Key=subdir+bid_to_index_file
        )
        logging.info(f'File Output = {bid_to_index_file}...')

        s3.put_object(
          Body=open(nn_map_file, 'rb')
             ,Bucket=s3_bucket
             ,Key=subdir+nn_map_file
        )
    os.remove(nn_map_file)

## KEYWORDS
logging.info(f'Starting Keywords Preprocessing: Dry-Run = {dryRun}, Dry-Export = {dryExport}, Bucket = {s3_bucket}, One Time Run = {oneTimeRun}, Force-Similarity = {forceSimilarity} , Jobs = {njobs}, Chunk Size = {chunk_size} ...')

last_processed_pks = pickle.loads(s3b.Bucket(s3_bucket).Object(f'{post_process_dir}/all_processed_pks.p').get()['Body'].read())

members_subset = reduce_member_list(last_processed_pks=last_processed_pks, oneTimeRun=oneTimeRun)
if len(members_subset)==0 and forceSimilarity==True:
    logging.info("No profiles to update for this run. Forcing Similarity to update anyways ...")
    run_similarity()
    exit()
elif len(members_subset)==0 and forceSimilarity==False:
    logging.info("No profiles to update for this run. Exiting ...")
    exit()
else:
    skills = skills_map(list(bolsters_db.query(PK__begins_with='ROLE#',SK__begins_with='SKILL#', fields='PK,SK,FullName', scan=True)))
    match_base, filterfields, SEQS, member_lids = profile_strings(members=members_subset, name_maps=skills)
    if oneTimeRun == True:
        pdl_multi = pdl_read_s3(start=0,stop=None,s3_bucket=s3_bucket)
        single_pdls = pdl_read_s3_single(s3_bucket=s3_bucket,subdir='single',member_lid_map=member_lids)
        pdl_dict = combine_pdl_data(multis=pdl_multi, singles=single_pdls)
    else:
        pdl_dict = pdl_read_s3_single(s3_bucket=s3_bucket,subdir='single',member_lid_map=member_lids)

if __name__ == '__main__':
    executor = Parallel(n_jobs=njobs, backend='multiprocessing', prefer="processes")
    tasks = (delayed(run_processor)(chunk) for chunk in chunks(data=match_base, SIZE=chunk_size))
    results = executor(tasks)

    prod = flatten(results)
    update_profile_cleanText(data=prod,dryRun=dryRun, ts=ts)
    everyone = intermediate_build(prod=prod, filterfields=filterfields, SEQS=SEQS)

    everyone_enrich = enrich_PDL(prod_df=everyone, pdl_dict=pdl_dict, s3_bucket=s3_bucket)
    new_processed_pks = everyone_enrich['PK'].to_list()
    all_processed_pks = list(set(last_processed_pks+new_processed_pks))

    if dryExport:
        logging.info(f'New PKs Processed: {len(new_processed_pks)} , Total PKs Processed {len(all_processed_pks)} ...')
    else:
        save_feature_vectors(final_df=everyone_enrich, s3_bucket=s3_bucket, feature_matrix_dir=feature_matrix_dir)

        pickle.dump(all_processed_pks, open(f'all_processed_pks.p', 'wb'))
        s3.put_object(
          Body=open('all_processed_pks.p', 'rb')
             ,Bucket=s3_bucket
             ,Key=f'{post_process_dir}/all_processed_pks.p'
        )
        os.remove('all_processed_pks.p')
        logging.info(f'New PKs Processed: {len(new_processed_pks)} , Total PKs Processed {len(all_processed_pks)} ...')

    ## SIMILARITY
    run_similarity()

    finish_ts = time.perf_counter()
    logging.info(f"PROGRAM RUN TIME: {finish_ts}")
