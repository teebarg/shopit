# api/products.py

import csv

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from google.cloud.firestore_v1.base_query import FieldFilter

import deps
import schemas

# Create a router for products
router = APIRouter()


@router.get("/", response_model=list[schemas.Product])
async def get_products(name: str = "", tag: str = "", limit: int = 20, db=Depends(deps.get_db)):
    """
    Get all products.
    """
    products_ref = db.collection("products")
    if name:
        # filter_1 = FieldFilter("name", ">=", q)
        # filter_2 = FieldFilter("name", "<=", q)

        # Create the union filter of the two filters (queries)
        # or_filter = Or(filters=[filter_1, filter_2])
        # query_ref = products_ref.where(filter=FieldFilter("name", ">=", q))
        # query_ref = products_ref.where('name', '>=', q).where('name', '<=', q + '\uf8ff').where(filter=FieldFilter("tags", "array_contains", "trending"));
        query_ref = products_ref.where("name", ">=", name).where("name", "<=", name + "\uf8ff")
        products_snapshot = query_ref.limit(limit).stream()
    elif tag:
        query_ref = products_ref.where(filter=FieldFilter("tags", "array_contains", tag))
        products_snapshot = query_ref.limit(limit).stream()
    else:
        products_snapshot = products_ref.limit(limit).get()

    return [schemas.Product(**product.to_dict(), id=product.id) for product in products_snapshot]


@router.get("/{product_id}", response_model=schemas.Product)
async def get_product(product_id: str, db=Depends(deps.get_db)):
    """
    Get a specific product by ID.
    """
    product_ref = db.collection("products").document(product_id)
    product = product_ref.get()
    if product.exists:
        return schemas.Product(**product.to_dict())
    else:
        raise HTTPException(status_code=404, detail="Product not found.")


@router.post("/", response_model=schemas.Product, status_code=201)
async def create_product(product: schemas.ProductCreate, db=Depends(deps.get_db)):
    """
    Create a new product.
    """
    product_data = product.dict()

    # Check if collections exist
    if product_data.get("collections"):
        collections_ref = db.collection("collections")
        for item in product_data["collections"]:
            collection_id = item.get("id")
            collection = collections_ref.document(collection_id).get()
            if not collection.exists:
                raise HTTPException(
                    status_code=404,
                    detail=f"Collection {collection_id} doesn't exist.",
                )

    # Check if the product already exists based on some unique identifier, e.g., "name"
    products_ref = db.collection("products")
    existing_product = products_ref.where("name", "==", product_data["name"]).get()

    if len(existing_product) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Product {product_data["name"]} already exists',
        )

    # Product does not exist, create the product document in the "products" collection
    product_ref = products_ref.document()
    product_ref.set(product_data)

    data = product_ref.get()
    return schemas.Product(**data.to_dict(), id=product_ref.id)


@router.put("/{product_id}", response_model=schemas.Product)
async def update_product(product_id: str, product: schemas.ProductUpdate, db=Depends(deps.get_db)):
    """
    Update a specific product by ID.
    """
    product_ref = db.collection("products").document(product_id)
    existing_product = product_ref.get()

    if existing_product.exists:
        product_ref.set(product.dict())
        data = product_ref.get()
        return schemas.Product(**data.to_dict(), id=product_ref.id)

    raise HTTPException(status_code=404, detail="Product not found.")


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


@router.put(
    "/{product_id}/add_to_collection/{collection_id}",
    response_model=schemas.Product,
)
async def add_product_to_collection(product_id: str, collection_id: str, db=Depends(deps.get_db)):
    """
    Add a product to a product collection.
    """
    product_ref = db.collection("products").document(product_id)
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found.")

    collection_ref = db.collection("product_collections").document(collection_id)
    collection = collection_ref.get()
    if not collection.exists:
        raise HTTPException(status_code=404, detail="Product collection not found.")

    # Add the product ID to the product's collections list
    product_collections = product.get("collections") or []
    if collection_id not in product_collections:
        product_collections.append(collection_id)
        product_ref.update({"collections": product_collections})

    # Add the product ID to the product collection's products list
    collection_products = collection.get("products") or []
    if product_id not in collection_products:
        collection_products.append(product_id)
        collection_ref.update({"products": collection_products})

    return schemas.Product(**product.to_dict())
