import os
import logging
import sys

from notifications.in_app.notifications import process_notifications_digest_summaries, process_opportunity_feed_digest_summaries

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

dryRun = os.environ.get('DRY_RUN', "True")
if dryRun == "False":
    dryRun = False
else:
    dryRun = True

logging.info(f"\n\nRunning Python Version {sys.version}\n\n")

logging.info(f"Starting notifications-digest: Dry-Run = {dryRun}")
# Note: This function updates the notification record so we will never send the same notification twice
process_notifications_digest_summaries(days=1, dryRun=dryRun)
# Note: This function works on a 1 day (yesterday UTC) window so we can get dupes if it runs twice on the same day
process_opportunity_feed_digest_summaries(days=1, dryRun=dryRun)
