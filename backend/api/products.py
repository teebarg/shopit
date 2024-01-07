# api/products.py

import csv
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.exc import IntegrityError

import crud
import deps
import schemas
from models.product import ProductOut

# Create a router for products
router = APIRouter()


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep,
    name: str = "",
    col: str = "",
    tag: str = "",
    offset: int = 0,
    limit: int = Query(default=20, le=100),
):
    """
    Get all products.
    """
    queries = {"col": col, "name": name, "tag": tag}

    products = crud.product.get_multi(db=db, queries=queries, limit=limit, offset=offset)
    return {
        "products": products,
        "offset": offset,
        "limit": limit,
    }


@router.get("/{id}", response_model=ProductOut)
async def show(id: str, db: deps.SessionDep):
    """
    Get a specific product by ID.
    """
    if product := crud.product.get(db=db, id=id):
        return product
    raise HTTPException(status_code=404, detail="Product not found.")


@router.post("/", response_model=ProductOut, status_code=201)
async def store(product: schemas.ProductCreate, db: deps.SessionDep):
    """
    Create a new product.
    """
    try:
        return crud.product.create(db=db, product=product)
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error creating product, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product, {e}")


@router.put("/{id}", response_model=ProductOut)
async def update(id: str, update: schemas.ProductUpdate, db: deps.SessionDep):
    """
    Update a specific product by ID.
    """
    try:
        if product := crud.product.get(db=db, id=id):
            return crud.product.update(db=db, db_obj=product, obj_in=update)
        raise HTTPException(status_code=404, detail="Product not found.")
    except IntegrityError as e:
        raise HTTPException(status_code=422, detail=f"Error updating product, {e.orig.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product, {e}")


@router.post("/import-products/")
async def import_products(csv_file: UploadFile = File(...), db=Depends(deps.get_db)):
    """
    Import products from a CSV file.
    """
    if not csv_file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only CSV files are allowed.",
        )

    products = []
    try:
        contents = await csv_file.read()
        decoded_content = contents.decode("utf-8")
        reader = csv.DictReader(decoded_content.splitlines(), delimiter=",")

        for row in reader:
            # Assuming your CSV has columns named "name" and "price"
            name = row["name"]
            price = float(row["price"])

            # Add product to the list
            products.append({"name": name, "price": price})

        # Batch write products to Firestore for better performance
        batch = db.batch()
        products_ref = db.collection("products")
        for product in products:
            doc_ref = products_ref.document()
            batch.set(doc_ref, product)

        batch.commit()
    except Exception:
        raise HTTPException(status_code=500, detail="Error while importing products.")

    return {"message": "Products imported successfully."}


@router.put("/{id}/collections", response_model=ProductOut)
async def product_collection(id: str, update: list[int], db: deps.SessionDep):
    """
    Update a specific product's collections by ID.
    """
    try:
        if product := crud.product.get(db=db, id=id):
            return crud.product.collection(db=db, db_obj=product, update=update)
        raise HTTPException(status_code=404, detail="Product not found.")
    except IntegrityError as e:
        raise HTTPException(
            status_code=422, detail=f"Error updating product's collections, {e.orig.pgerror}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product's collections, {e}")


@router.put("/{id}/tags", response_model=ProductOut)
async def product_tag(id: str, update: list[int], db: deps.SessionDep):
    """
    Update a specific product's tags by ID.

    payload = {
        "tags": [1, 2, 3]
    }
    """
    try:
        if product := crud.product.get(db=db, id=id):
            return crud.product.tag(db=db, db_obj=product, update=update)
        raise HTTPException(status_code=404, detail="Product not found.")
    except IntegrityError as e:
        raise HTTPException(
            status_code=422, detail=f"Error updating product's tags, {e.orig.pgerror}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product's tags, {e}")
