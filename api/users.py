# api/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv  # Import the load_dotenv function
from core.config import settings  # Import the custom settings from core.config

# Create a router for users
router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for JWT
SECRET_KEY = "your-secret-key"  # Replace with a strong and secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Load the environment variables from .env
load_dotenv()

# Get the environment variables
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)

# Sample user data (you can replace this with your database)
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": "$2b$12$ED/uH47AqBcxS7mo5YstyeKlChj07bS6EVyJhvOOhPbAjCTBliipm",  # Password: testpassword
    }
}

# Pydantic model for user credentials
class UserCredentials(BaseModel):
    username: str
    password: str

# Function to verify user credentials
def verify_user(credentials: UserCredentials):
    user = fake_users_db.get(credentials.username)
    if not user or not pwd_context.verify(credentials.password, user["hashed_password"]):
        return None
    return user

# Function to generate access token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login/")
async def login_for_access_token(credentials: UserCredentials):
    """
    User login to get access token (JWT).
    """
    user = verify_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# ... (you can add more user-related endpoints here)
