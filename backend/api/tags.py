# api/tags.py

from typing import Any

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.exc import IntegrityError

import crud
import deps
import schemas
from models.product import Tag

# Create a router for tags
router = APIRouter()


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep, name: str = "", offset: int = 0, limit: int = Query(default=20, le=100)
):
    """
    Get all tags.

    :param db: The database session dependency.
    :param name: Optional name parameter to filter tags by name.
    :param offset: Optional offset parameter for pagination.
    :param limit: Optional limit parameter for pagination (default: 20, max: 100).
    :return: A dictionary containing the list of tags, offset, and limit.
    """
    tags = crud.tag.get_multi(db=db, queries={"name": name}, limit=limit, offset=offset)
    return {
        "tags": tags,
        "offset": offset,
        "limit": limit,
    }


@router.get("/{id}", response_model=Tag)
async def show(id: str, db: deps.SessionDep):
    """
    Get a specific tag by ID.
    """
    if tag := crud.tag.get(db=db, id=id):
        return tag
    raise HTTPException(status_code=404, detail="Tag not found.")


@router.post("/", response_model=Tag, status_code=201)
async def create(tag: schemas.TagCreate, db: deps.SessionDep):
    """
    Create a new tag.
    """
    try:
        return crud.tag.create(db=db, obj_in=tag)
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error creating tag, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating tag, {e}")


@router.put("/{id}", response_model=Tag)
async def update(id: int, update: schemas.TagUpdate, db: deps.SessionDep):
    """
    Update a specific tag by ID.
    """
    try:
        if tag := crud.tag.get(db=db, id=id):
            return crud.tag.update(db=db, db_obj=tag, obj_in=update)
        raise HTTPException(status_code=404, detail="Tag not found.")
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error updating tag, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating tag, {e}")


@router.delete("/{id}", response_model=Tag)
async def delete(id: int, db: deps.SessionDep):
    """
    Get a specific tag by ID.
    """
    try:
        if tag := crud.tag.remove(db=db, id=id):
            return tag
        raise HTTPException(status_code=404, detail="Tag not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting tag, invalid tag id, {e}")
