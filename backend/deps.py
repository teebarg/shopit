from typing import Annotated, Generator

import firebase_admin
import pyrebase
import requests
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, credentials
from sqlmodel import Session

import crud
import schemas
from core.config import settings
from db.engine import engine
from models.models import User

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login/access-token")


def get_db() -> Generator:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_auth() -> Generator:
    try:
        if not firebase_admin._apps:  # Check if the app is not already initialized
            cred = credentials.Certificate(settings.FIREBASE_CRED)
            firebase_admin.initialize_app(cred)

        firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)

        # Get a reference to the auth service
        yield firebase.auth()
    finally:
        print("auth closed")


def get_current_user_old(
    token: str = Depends(reusable_oauth2), db=Depends(get_db)
) -> schemas.UserInDB:
    try:
        user = auth.verify_id_token(token)
        doc_ref = db.collection("users").document(user["uid"])
        doc = doc_ref.get()
        return doc.to_dict()
    except requests.exceptions.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"An error occurred while trying to validate credentials, {e}",
        )


def get_current_user(db: SessionDep, token: TokenDep) -> User:
    try:
        data = auth.verify_id_token(token)
        user: User = crud.get_user_by_email(db=db, email=data["email"])

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    except requests.exceptions.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while trying to validate credentials, {e}",
        )


def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


CurrentUser = Annotated[User, Depends(get_current_active_user)]

# def get_current_active_superuser(
#     current_user: schemas.User = Depends(get_current_user),
# ) -> schemas.User:
#     if not crud.user.is_superuser(current_user):
#         raise HTTPException(
#             status_code=400, detail="The user doesn't have enough privileges"
#         )
#     return current_user
