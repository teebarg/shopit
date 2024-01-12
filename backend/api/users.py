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
    db: deps.SessionDep,
    current_user: deps.CurrentUser,
    name: str = "",
    page: int = Query(default=1, gt=0),
    per_page: int = Query(default=20, le=100),
):
    """
    Get all users.
    """
    users = crud.user.get_multi(
        db=db, queries={"name": name}, per_page=per_page, offset=(page - 1) * per_page
    )
    # Get total count
    total_count = crud.user.all(db=db).count()

    # Calculate total pages
    total_pages = (total_count // per_page) + (total_count % per_page > 0)
    return {
        "users": users,
        "page": page,
        "per_page": per_page,
        "total_count": total_count,
        "total_pages": total_pages,
    }
