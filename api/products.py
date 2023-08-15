# api/products.py

from fastapi import APIRouter, HTTPException, UploadFile, File, status
from db.firebase import initialize_firestore
import csv
import firebase_admin
from firebase_admin import credentials, firestore
from pydantic import BaseModel

# Initialize Firestore client
db = initialize_firestore()

# Create a router for products
router = APIRouter()

# Pydantic model for the product
class Product(BaseModel):
    name: str
    price: float
    collections: list[str]  # New field to hold collection IDs

@router.get("/", response_model=list[Product])
async def get_products():
    """
    Get all products.
    """
    products_ref = db.collection("products")
    products_snapshot = products_ref.get()
    return [Product(**product.to_dict()) for product in products_snapshot]


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """
    Get a specific product by ID.
    """
    product_ref = db.collection("products").document(product_id)
    product = product_ref.get()
    if product.exists:
        return Product(**product.to_dict())
    else:
        raise HTTPException(status_code=404, detail="Product not found.")
    

@router.post("/", response_model=Product, status_code=201)
async def create_product(product: Product):
    """
    Create a new product.
    """
    product_data = product.dict()

    # Check if the product already exists based on some unique identifier, e.g., "name"
    products_ref = db.collection("products")
    existing_product = products_ref.where("name", "==", product_data["name"]).get()

    if len(existing_product) > 0:
        # Product with the same name already exists, return an error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Product {product_data["name"]} already exists')

    # Product does not exist, create the product document in the "products" collection
    product_ref = products_ref.document()
    product_ref.set(product_data)

    return product


@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product: Product):
    """
    Update a specific product by ID.
    """
    product_ref = db.collection("products").document(product_id)
    product_ref.set(product.dict())
    return product


@router.post("/import-products/")
async def import_products(csv_file: UploadFile = File(...)):
    """
    Import products from a CSV file.
    """
    if not csv_file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV files are allowed.")

    products = []
    try:
        contents = await csv_file.read()
        decoded_content = contents.decode("utf-8")
        reader = csv.DictReader(decoded_content.splitlines(), delimiter=',')
        
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
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error while importing products.")
    
    return {"message": "Products imported successfully."}


@router.put("/{product_id}/add_to_collection/{collection_id}", response_model=Product)
async def add_product_to_collection(product_id: str, collection_id: str):
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
    
    return Product(**product.to_dict())


# Upload products from csv file
# @router.post("/products/upload", status_code=201)
# async def upload_products():
#     """
#     Upload products from csv file
#     """
#     #read csv file
#     import csv
#     with open('products.csv', newline='') as csvfile:
#         reader = csv.DictReader(csvfile)
#         for row in reader:
#             #add product to firestore
#             db.collection("products").add(row)
#     return {"message": "Products uploaded successfully."}

