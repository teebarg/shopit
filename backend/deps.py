from typing import Annotated, Any, Generator

import firebase_admin
import pyrebase
import requests
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from firebase_admin import auth, credentials, storage
from sqlmodel import Session

import crud
from core.config import settings
from core.logging import logger
from db.engine import engine
from models.models import User

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login/password")


def get_db() -> Generator:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
TokenDep2 = Annotated[str, Depends(APIKeyHeader(name="X-Auth"))]


def get_auth() -> Generator:
    try:
        if not firebase_admin._apps:  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED)
            firebase_admin.initialize_app(
                cred, {"storageBucket": settings.STORAGE_BUCKET}
            )
        firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)

        # Get a reference to the auth service
        yield firebase.auth()
    except Exception as e:
        logger.error(f"get_auth(auth init) Error, ${e}")
        raise
    finally:
        logger.debug("auth closed")


def get_storage() -> Generator:
    try:
        if not firebase_admin._apps:  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED)
            firebase_admin.initialize_app(
                cred, {"storageBucket": settings.STORAGE_BUCKET}
            )

        # Get a reference to the bucket
        yield storage.bucket()
    except Exception as e:
        logger.error(f"storage init error, {e}")
        raise
    finally:
        logger.debug("storage closed")


def get_token_uid(token: TokenDep2, auth2: Any = Depends(get_auth)) -> str:
    try:
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token cannot be none",
            )

        data = auth.verify_id_token(token)
        if "uid" in data:
            return data["uid"]
        else:
            raise HTTPException(status_code=403, detail="invalid ")
    except Exception as e:
        logger.error(f"Get get_token_uid error, ${e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"An error occurred while trying to validate credentials, {e}",
        )


def get_current_user(
    db: SessionDep, token: TokenDep2, auth2: Any = Depends(get_auth)
) -> User:
    try:
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token cannot be none",
            )

        data = auth.verify_id_token(token, check_revoked=True)
        if "email" in data:
            if user := crud.get_user_by_email(db=db, email=data["email"]):
                return user
        if user := crud.user.get(db=db, id=data["uid"]):
            return user
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You have been signout",
        )
    except auth.UserDisabledError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user is currently disabled",
        )
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The provided token is invalid",
        )
    except requests.exceptions.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    except Exception as e:
        logger.error(f"Get current user error, ${e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"An error occurred while trying to validate credentials, {e}",
        )


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if not current_user:
        raise HTTPException(status_code=403, detail="Unauthenticated user")
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


CurrentUser = Annotated[User, Depends(get_current_active_user)]
