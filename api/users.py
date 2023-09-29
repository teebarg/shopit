# api/users.py

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

import deps
import schemas
from core.config import settings  # Import the custom settings from core.config

# Create a router for users
router = APIRouter()


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: schemas.User = Depends(deps.get_current_user),
) -> schemas.User:
    """
    Get current user.
    """
    return current_user
