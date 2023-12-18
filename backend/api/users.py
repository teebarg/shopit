from typing import Any

from fastapi import APIRouter, Query

import crud
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


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep, name: str = "", offset: int = 0, limit: int = Query(default=20, le=100)
):
    """
    Get all users.
    """
    queries = {"name": name}

    users = crud.user.get_multi(db=db, queries=queries, limit=limit, offset=offset)
    return {
        "users": users,
        "offset": offset,
        "limit": limit,
    }
