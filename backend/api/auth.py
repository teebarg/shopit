from datetime import datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from firebase_admin import auth as firebase_auth

import crud
import deps
import schemas
from core.config import settings
from models.models import User, UserCreate

# Create a router for users
router = APIRouter()


@router.post("/login")
async def login_for_access_token(
    credentials: schemas.SignIn,
    auth: Any = Depends(deps.get_auth),
    db=Depends(deps.get_db)
) -> Any:
    """
    User login to get access token (JWT).
    """
    email = credentials.email
    password = credentials.password
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        content = {
            "message": "success",
            "access_token": user["idToken"],
            "refresh_token": user["refreshToken"],
            "expires": get_timestamp(),
        }

        # Enrich user
        if user := crud.get_user_by_email(db=db, email=user["email"]):
            details = user.dict()
            details["name"] = details["firstname"] + " " + details["lastname"]
            content |= details

        return content
    except Exception as e:
        if "INVALID_LOGIN_CREDENTIALS" in str(e):
            raise HTTPException(
                status_code=400, detail="Invalid login credentials"
            ) from e
        else:
            raise HTTPException(status_code=400, detail="An error occurred") from e


@router.post("/signup")
async def sign_up(
    credentials: schemas.SignUp,
    session: deps.SessionDep,
    auth: Any = Depends(deps.get_auth),
):
    """
    User login to get access token (JWT).
    """
    email = credentials.email
    password = credentials.password
    confirmPassword = credentials.confirmPassword
    firstname = credentials.firstname
    lastname = credentials.lastname

    # Validate password
    if password != confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    try:
        # user = firebase_auth.create_user( email=email, password=password)
        user = auth.create_user_with_email_and_password(email=email, password=password)

        user_in = UserCreate(firstname=firstname, lastname=lastname, email=email)
        crud.user.create(db=session, obj_in=user_in)

        return JSONResponse(
            status_code=200,
            content={"message": "success", "token": user.get("idToken")},
        )
    except Exception as e:
        if "EMAIL_EXISTS" in str(e):
            raise HTTPException(status_code=400, detail="email already exists") from e
        elif "INVALID_EMAIL" in str(e):
            raise HTTPException(status_code=400, detail="invalid email") from e
        else:
            raise HTTPException(status_code=400, detail="An error occurred") from e


@router.post("/login/password", response_model=schemas.Token)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth: Any = Depends(deps.get_auth),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    try:
        user = auth.sign_in_with_email_and_password(
            form_data.username, form_data.password
        )
        return JSONResponse(
            status_code=200,
            content={
                "access_token": user["idToken"],
                "refresh_token": user["refreshToken"],
                "expires": get_timestamp(),
                "token_type": "bearer",
            },
        )
    except Exception as e:
        if "INVALID_LOGIN_CREDENTIALS" in str(e):
            raise HTTPException(
                status_code=400, detail="Incorrect email or password"
            ) from e
        else:
            raise HTTPException(status_code=400, detail="An error occurred") from e


@router.post("/logout")
def logout(uid: str = Depends(deps.get_token_uid)) -> Any:
    """
    Log out current user.
    """
    try:
        firebase_auth.revoke_refresh_tokens(uid)
        return JSONResponse(
            status_code=200,
            content={"message": "User signed out successfully"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error signing out user. Error: ${e}"
        ) from e


@router.post("/refresh-token")
def refresh_token(
    refresh_token: str,
    current_user: deps.CurrentUser,
    auth: Any = Depends(deps.get_auth),
) -> Any:
    """
    Refresh access token.
    """
    try:
        user = auth.refresh(refresh_token)
        return JSONResponse(
            status_code=200,
            content={
                "access_token": user["idToken"],
                "refresh_token": user["refreshToken"],
                "expires": get_timestamp(),
                "token_type": "bearer",
            },
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Error refreshing token")


@router.post("/social")
def social(
    credentials: schemas.Social,
    db: deps.SessionDep,
    auth: Any = Depends(deps.get_auth),
) -> Any:
    """
    Create a new user from social login if user does not exist.
    """

    email = credentials.email

    def get_token(uid: str) -> str:
        custom_token = firebase_auth.create_custom_token(uid).decode("utf-8")
        user = auth.sign_in_with_custom_token(custom_token)
        return {
            "access_token": user["idToken"],
            "refresh_token": user["refreshToken"],
            "expires": get_timestamp(),
            "token_type": "bearer",
        }

    try:
        user: User = crud.get_user_by_email(db=db, email=email)
        if user:
            return JSONResponse(status_code=200, content=get_token(str(user.id)))

        user: User = crud.user.create(db=db, obj_in=credentials)
        return JSONResponse(status_code=200, content=get_token(str(user.id)))

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"message": "An error occurred", "error": str(e)},
        )


def get_timestamp() -> int:
    # Get the current datetime
    current_datetime = datetime.now()

    # Add 1 hour (3600 seconds) to the current datetime.
    new_datetime = current_datetime + timedelta(
        seconds=settings.ACCESS_TOKEN_EXPIRE_SECONDS
    )

    # Convert the new datetime to a Unix timestamp (milliseconds since epoch).
    return int(new_datetime.timestamp() * 1000)
