# api/products.py

import csv
from io import BytesIO
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.exc import IntegrityError

import crud
import deps
import schemas
from core.logging import logger
from models.product import ProductOut

# Create a router for products
router = APIRouter()


@router.get("/", response_model=dict[str, Any])
async def index(
    db: deps.SessionDep,
    name: str = "",
    col: str = "",
    tag: str = "",
    page: int = Query(default=1, gt=0),
    per_page: int = Query(default=20, le=100),
):
    """
    Get all products.
    """
    queries = {"col": col, "name": name, "tag": tag}

    products = crud.product.get_multi(
        db=db, queries=queries, per_page=per_page, offset=(page - 1) * per_page
    )
    # Get total count
    total_count = crud.product.all(db=db).count()

    # Calculate total pages
    total_pages = (total_count // per_page) + (total_count % per_page > 0)
    return {
        "products": products,
        "page": page,
        "per_page": per_page,
        "total_count": total_count,
        "total_pages": total_pages,
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
        raise HTTPException(
            status_code=422, detail=f"Error creating product, {e.orig.pgerror}"
        )
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
        raise HTTPException(
            status_code=422, detail=f"Error updating product, {e.orig.pgerror}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product, {e}")


@router.delete("/{id}", response_model=ProductOut)
async def delete(id: int, db: deps.SessionDep):
    """
    Delete a specific product by ID.
    """
    try:
        if product := crud.product.remove(db=db, id=id):
            return product
        raise HTTPException(status_code=404, detail="Product not found.")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting product, invalid product id, {e}"
        )


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
            status_code=422,
            detail=f"Error updating product's collections, {e.orig.pgerror}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error updating product's collections, {e}"
        )


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
        raise HTTPException(
            status_code=500, detail=f"Error updating product's tags, {e}"
        )


# Upload product image
@router.patch("/{id}/image", response_model=Any)
async def upload_product_image(
    id: str,
    file: UploadFile = File(...),
    db=Depends(deps.get_db),
    bucket=Depends(deps.get_storage),
):
    """
    Upload a product image.
    """
    # if not image.filename.endswith(".jpg"):
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Invalid file format. Only JPG files are allowed.",
    #     )

    try:
        # Check file size
        max_size_kb = 200

        # Read the file content
        file_content = await file.read()

        if len(file_content) > max_size_kb * 1024:
            return {"message": "File size exceeds KB"}
            # raise HTTPException(status_code=400, detail="File size exceeds KB")
            # raise HTTPException(status_code=400, detail=f"File size exceeds {max_size_kb} KB")

        file_name = f"{id}.jpeg"
        blob = bucket.blob(file_name)
        blob.upload_from_file(BytesIO(file_content), content_type=file.content_type)

        if product := crud.product.get(db=db, id=id):
            return crud.product.update(
                db=db, db_obj=product, obj_in={"image": file_name}
            )
        raise HTTPException(status_code=404, detail="Product not found.")

        # return {"message": "Product image uploaded successfully."}
    except Exception as e:
        logger.error(f"An exception occurred while trying to upload image: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error while uploading product image. {e}"
        )
