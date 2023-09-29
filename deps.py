from typing import Any, Generator

import firebase_admin
import pyrebase
import requests
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, credentials, firestore

import schemas
from core.config import settings

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login/access-token")


def get_db() -> Generator:
    try:
        if (
            not firebase_admin._apps
        ):  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED_PATH)
            firebase_admin.initialize_app(cred)

        # Get a reference to the db service
        yield firestore.client()
    finally:
        print("db closed")


def get_auth() -> Generator:
    try:
        if (
            not firebase_admin._apps
        ):  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED_PATH)
            firebase_admin.initialize_app(cred)

        firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)

        # Get a reference to the auth service
        yield firebase.auth()
    finally:
        print("auth closed")


def get_current_user(token: str = Depends(reusable_oauth2)) -> schemas.User:
    try:
        return auth.verify_id_token(token)
    except requests.exceptions.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="An error occurred while trying to validate credentials",
        )


def get_current_active_user(
    current_user: schemas.User = Depends(get_current_user),
) -> schemas.User:
    return current_user


# def get_current_active_superuser(
#     current_user: schemas.User = Depends(get_current_user),
# ) -> schemas.User:
#     if not crud.user.is_superuser(current_user):
#         raise HTTPException(
#             status_code=400, detail="The user doesn't have enough privileges"
#         )
#     return current_user
