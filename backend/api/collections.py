from fastapi import APIRouter, Depends, HTTPException, status

import deps
import schemas

# Create a router for product collections
router = APIRouter()


@router.get("/", response_model=list[schemas.Collection])
async def get_collections(db=Depends(deps.get_db)):
    """
    Get all product collections.
    """
    collections_ref = db.collection("collections")
    collections_snapshot = collections_ref.get()

    return [
        schemas.Collection(**collection.to_dict(), id=collection.id)
        for collection in collections_snapshot
    ]


@router.get("/{collection_id}", response_model=schemas.Collection)
async def get_collection(collection_id: str, db=Depends(deps.get_db)):
    """
    Get a specific product collection by ID.
    """
    collection_ref = db.collection("collections").document(collection_id)
    collection = collection_ref.get()
    if collection.exists:
        return schemas.Collection(**collection.to_dict(), id=collection_ref.id)
    else:
        raise HTTPException(status_code=404, detail="collection not found.")


@router.post("/", response_model=schemas.Collection, status_code=201)
async def create_collection(
    collection: schemas.CollectionCreate, db=Depends(deps.get_db)
):
    """
    Create a new product collection.
    """
    collection_data = collection.dict()

    # check if the collection already exists based on some unique identifier, e.g., "name"
    collections_ref = db.collection("collections")
    existing_collection = collections_ref.where(
        "name", "==", collection_data["name"]
    ).get()
    if len(existing_collection) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collection already exists",
        )

    # Create the product collection document in the "product_collections" collection
    collection_ref = collections_ref.document()
    collection_ref.set(collection_data)
    data = collection_ref.get()
    return schemas.Collection(**data.to_dict(), id=collection_ref.id)


# @router.put("/{collection_id}", response_model=Collection)
# async def update_collection(collection_id: str, collection: Collection):
#     """
#     Update a specific product collection by ID.
#     """
#     collection_ref = db.collection("collections").document(collection_id)
#     collection_ref.set(collection.dict())
#     return collection
