from sqlmodel import Session, select

import crud
from core.config import settings
from core.logging import logger
from models.models import User, UserCreate

# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(session: Session, auth) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        try:
            user_in = UserCreate(
                firstname=settings.FIRST_SUPERUSER_FIRSTNAME,
                lastname=settings.FIRST_SUPERUSER_LASTNAME,
                email=settings.FIRST_SUPERUSER,
                is_superuser=True,
            )
            user = crud.user.create(db=session, obj_in=user_in)
            auth.create_user(
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
            )
        except Exception as e:
            logger.error(e)
