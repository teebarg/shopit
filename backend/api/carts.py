# api/cart.py

from typing import Any

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.exc import IntegrityError

import crud
import deps
import schemas
from models.cart import Cart

# Create a router for cart
router = APIRouter()


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep, name: str = "", offset: int = 0, limit: int = Query(default=20, le=100)
):
    """
    Get all carts.

    :param db: The database session dependency.
    :param name: Optional name parameter to filter Carts by name.
    :param offset: Optional offset parameter for pagination.
    :param limit: Optional limit parameter for pagination (default: 20, max: 100).
    :return: A dictionary containing the list of Carts, offset, and limit.
    """
    queries = {"name": name}

    carts = crud.cart.get_multi(db=db, queries=queries, limit=limit, offset=offset)
    return {
        "carts": carts,
        "offset": offset,
        "limit": limit,
    }


@router.get("/{id}", response_model=Cart)
async def show(id: str, db: deps.SessionDep):
    """
    Get a specific cart by ID.
    """
    if cart := crud.cart.get(db=db, id=id):
        return cart
    raise HTTPException(status_code=404, detail="Cart not found.")


@router.post("/", response_model=Cart, status_code=201)
async def create(cart: schemas.CartCreate, db: deps.SessionDep):
    """
    Create a new cart.
    """
    try:
        return crud.cart.create(db=db, obj_in=cart)
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"An error occurred, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred, {e}")


@router.put("/{id}", response_model=Cart)
async def update(id: int, update: schemas.CartUpdate, db: deps.SessionDep):
    """
    Update a specific cart by ID.
    """
    try:
        if cart := crud.cart.get(db=db, id=id):
            return crud.cart.update(db=db, db_obj=cart, obj_in=update)
        raise HTTPException(status_code=404, detail="Cart not found.")
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error updating cart, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating cart, {e}")


@router.delete("/{id}", response_model=Cart)
async def delete(id: int, db: deps.SessionDep):
    """
    Get a specific cart by ID.
    """
    try:
        if cart := crud.cart.remove(db=db, id=id):
            return cart
        raise HTTPException(status_code=404, detail="Cart not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting cart, invalid cart id, {e}")
