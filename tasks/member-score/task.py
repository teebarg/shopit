import os
import sys
from datetime import datetime
import boto3
import json
import gzip
import itertools
import pandas as pd
import operator
import collections
import numpy as np
import random
from random import shuffle
import logging

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

sys.path.append('../../lib')
from dydb import bolsters_db
from rankings.member_profile import update_profile_scores, run_shuffle, shuffle_round_scores

dryRun = os.environ.get('DRY_RUN', "True")
dryRun = False if dryRun == "False" else True

currentEnv = os.environ.get('CURRENT_ENV')

"""SHUFFLE_RUN uses day of the week number (0-6, 6 being Sunday) or 'now' for Today"""
shuffleRun = os.environ.get('SHUFFLE_RUN', "6")

logging.info(f"\n\nRunning Python Version {sys.version}\n\n")

## RUN PROFILE RANKS ##
ts_start = datetime.now()
logging.info(f'Starting Member Profile Scores: Dry-Run = {dryRun} , Current-Env = {currentEnv} , Shuffle-Run = {shuffleRun} ...')
update_profile_scores(dryRun=dryRun, currentEnv=currentEnv)
run_shuffle(dryRun=dryRun, shuffleRun=shuffleRun)
logging.info("Completed Run Time: %s seconds", (datetime.now() - ts_start).total_seconds())
