from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from firebase_admin import auth as firebase_auth

import deps
import schemas

# Create a router for users
router = APIRouter()


@router.post("/login")
async def login_for_access_token(
    credentials: schemas.UserCredentials,
    auth: Any = Depends(deps.get_auth),
    db=Depends(deps.get_db),
):
    """
    User login to get access token (JWT).
    """
    email = credentials.email
    password = credentials.password
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        content = {
            "message": "success",
            "token": user["idToken"],
            "id": user["localId"],
        }

        # Enrich user
        doc_ref = db.collection("users").document(user["localId"])
        doc = doc_ref.get()
        if doc.exists:
            details = doc.to_dict()
            details["name"] = details["firstname"] + " " + details["lastname"]
            content |= details

        return JSONResponse(
            status_code=200,
            content=content,
        )
    except Exception as e:
        if "INVALID_LOGIN_CREDENTIALS" in str(e):
            raise HTTPException(
                status_code=400, detail="Invalid login credentials"
            )
        else:
            raise HTTPException(status_code=400, detail="An error occurred")


@router.post("/signup")
async def sign_up(
    credentials: schemas.SignUp,
    auth: Any = Depends(deps.get_auth),
    db=Depends(deps.get_db),
):
    """
    User login to get access token (JWT).
    """
    email = credentials.email
    password = credentials.password
    confirmPassword = credentials.confirmPassword
    firstname = credentials.firstname
    lastname = credentials.lastname
    phone = credentials.phone

    # Validate password
    if password != confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    try:
        # user = firebase_auth.create_user( email=email, password=password)
        user = auth.create_user_with_email_and_password(
            email=email, password=password
        )

        user_ref = db.collection("users").document(user["localId"])
        user_ref.set(
            {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "uid": user["localId"],
                "role": "user",
                "phone": phone,
            },
            merge=True,
        )

        return JSONResponse(
            status_code=200,
            content={"message": "success", "token": user.get("idToken")},
        )
    except Exception as e:
        if "EMAIL_EXISTS" in str(e):
            raise HTTPException(status_code=400, detail="email already exists")
        elif "INVALID_EMAIL" in str(e):
            raise HTTPException(status_code=400, detail="invalid email")
        else:
            raise HTTPException(status_code=400, detail="An error occurred")


@router.post("/login/access-token", response_model=schemas.Token)
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
            content={"access_token": user["idToken"], "token_type": "bearer"},
        )
    except Exception as e:
        if "INVALID_LOGIN_CREDENTIALS" in str(e):
            raise HTTPException(
                status_code=400, detail="Incorrect email or password"
            )
        else:
            raise HTTPException(status_code=400, detail="An error occurred")


@router.post("/logout")
def logout(current_user: schemas.User = Depends(deps.get_current_user)) -> Any:
    """
    Log out current user.
    """
    try:
        firebase_auth.revoke_refresh_tokens(current_user.get("uid"))
        return JSONResponse(
            status_code=200,
            content={"message": "User signed out successfully"},
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Error signing out user")
