from typing import Annotated, Any, Generator

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
        if not firebase_admin._apps:  # Check if the app is not already initialized!!!
            cred = credentials.Certificate(settings.FIREBASE_CRED)
            firebase_admin.initialize_app(cred)
        firebase = pyrebase.initialize_app(settings.FIREBASE_CONFIG)

        # Get a reference to the auth service
        yield firebase.auth()
    except Exception as e:
        print(f"auth init error, ${e}")
    finally:
        print("auth closed")


def get_current_user(db: SessionDep, token: TokenDep, auth2: Any = Depends(get_auth)) -> User:
    try:
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token cannot be none",
            )

        data = auth.verify_id_token(token)
        if "email" in data:
            if user := crud.get_user_by_email(db=db, email=data["email"]):
                return user
        if user := crud.user.get(db=db, id=data["uid"]):
            return user

        else:
            raise HTTPException(status_code=404, detail="User not found")
    except requests.exceptions.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    except Exception as e:
        print(f"Get current user error, ${e}")
        if "Token expired" in str(e):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token expired",
            )
        if "Wrong number of segments in token" in str(e):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Provide a valid token",
            )
        if "Could not verify token signature." in str(e):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not verify token signature.",
            )
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
