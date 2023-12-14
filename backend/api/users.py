from fastapi import APIRouter

import deps
from models.models import User

# Create a router for users
router = APIRouter()


@router.get("/me")
def read_user_me(session: deps.SessionDep, current_user: deps.CurrentUser) -> User:
    """
    Get current user.
    """
    return current_user  # type: ignore
