# api/collections.py

from typing import Any

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.exc import IntegrityError

import crud
import deps
import schemas
from models.product import Collection

# Create a router for collections
router = APIRouter()


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep,
    name: str = "",
    page: int = Query(default=1, gt=0),
    per_page: int = Query(default=20, le=100),
):
    """
    Get all collections.
    """
    collections = crud.collection.get_multi(
        db=db, queries={"name": name}, per_page=per_page, offset=(page - 1) * per_page
    )
    return {
        "collections": collections,
        "page": page,
        "per_page": per_page,
    }


@router.get("/{id}", response_model=Collection)
async def show(id: str, db: deps.SessionDep):
    """
    Get a specific collection by ID.
    """
    if collection := crud.collection.get(db=db, id=id):
        return collection
    raise HTTPException(status_code=404, detail="Collection not found.")


@router.post("/", response_model=Collection, status_code=201)
async def create(collection: schemas.CollectionCreate, db: deps.SessionDep):
    """
    Create a new collection.
    """
    try:
        return crud.collection.create(db=db, obj_in=collection)
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error creating collection, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating collection, {e}")


@router.put("/{id}", response_model=Collection)
async def update(id: int, update: schemas.CollectionUpdate, db: deps.SessionDep):
    """
    Update a specific collection by ID.
    """
    try:
        if collection := crud.collection.get(db=db, id=id):
            return crud.collection.update(db=db, db_obj=collection, obj_in=update)
        raise HTTPException(status_code=404, detail="Collection not found.")
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error updating collection, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating collection, {e}")


@router.delete("/{id}", response_model=Collection)
async def delete(id: int, db: deps.SessionDep):
    """
    Get a specific collection by ID.
    """
    try:
        if collection := crud.collection.remove(db=db, id=id):
            return collection
        raise HTTPException(status_code=404, detail="Collection not found.")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting collection, invalid collection id, {e}"
        )
