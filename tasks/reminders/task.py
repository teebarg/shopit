import os
import logging
import sys

from notifications.mail.reminders import process_member_reminder

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

dry_run = os.environ.get('DRY_RUN', "True") == "True"
runtime_env = os.environ.get('ENV', 'dev')

logging.info(f"\n\nRunning Python Version {sys.version}\n\n")

logging.info(f"Starting notifications-reminders (Member Reminders): Dry-Run = {dry_run}")
process_member_reminder(dry_run=dry_run, runtime_env=runtime_env)
