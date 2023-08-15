# api/collections.py

import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.firebase import initialize_firestore

# Initialize Firestore client
db = initialize_firestore()

# Create a router for product collections
router = APIRouter()

# Pydantic model for the product collection
class Collection(BaseModel):
    name: str
    products: list[str]

@router.get("/", response_model=list[Collection])
async def get_collections():
    """
    Get all product collections.
    """
    collections_ref = db.collection("collections")
    collections_snapshot = collections_ref.get()
    return [Collection(**collection.to_dict()) for collection in collections_snapshot]


@router.get("/{collection_id}", response_model=Collection)
async def get_collection(collection_id: str):
    """
    Get a specific product collection by ID.
    """
    collection_ref = db.collection("collections").document(collection_id)
    collection = collection_ref.get()
    if collection.exists:
        return Collection(**collection.to_dict())
    else:
        raise HTTPException(status_code=404, detail="Product collection not found.")


@router.put("/{collection_id}", response_model=Collection)
async def update_collection(collection_id: str, collection: Collection):
    """
    Update a specific product collection by ID.
    """
    collection_ref = db.collection("collections").document(collection_id)
    collection_ref.set(collection.dict())
    return collection


@router.post("/", response_model=Collection, status_code=201)
async def create_product_collection(collection: Collection):
    """
    Create a new product collection.
    """
    collection_data = collection.dict()
    
    # Create the product collection document in the "product_collections" collection
    collections_ref = db.collection("collections")
    collection_ref = collections_ref.document()
    collection_data['products'] = []  # Initialize products as an empty list
    collection_ref.set(collection_data)
    
    return collection
