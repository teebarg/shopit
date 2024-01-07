import logging

import firebase_admin
from firebase_admin import auth, credentials
from sqlmodel import Session

from core.config import settings
from db.engine import engine
from db.init_db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    with Session(engine) as session:
        if not firebase_admin._apps:  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED)
            firebase_admin.initialize_app(cred)
        init_db(session, auth)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
