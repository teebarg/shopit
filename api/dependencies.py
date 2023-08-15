# api/dependencies.py

from urllib.request import Request
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import JWTError
from db.firebase import initialize_firestore
from core.config import settings


# Initialize Firestore client
db = initialize_firestore()

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        SECRET_KEY = settings.SECRET_KEY
        ALGORITHM = settings.ALGORITHM
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    

async def authorize_user(request: Request):
    """
    Check if the user is authorized to access the resource.
    """
    # Get the access token from the request headers
    access_token = request.headers.get("Authorization").split()[1]
    
    # Get the user ID from the access token
    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = settings.ALGORITHM
    payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload["sub"]
    
    # Check if the user exists in the database
    users_ref = db.collection("users").document(user_id)
    user = users_ref.get()
    if not user.exists:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    # Check if the user is an admin
    if not user.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not an admin")
    
    return user_id
