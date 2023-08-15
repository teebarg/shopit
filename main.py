# from typing import Union

from fastapi import FastAPI

app = FastAPI()

# Import the product collections and products routers
from api.products import router as products_router
from api.collections import router as collections_router
from api.cart import router as cart_router
from api.users import router as users_router  # Import the user router

# Mount the routers under their respective paths
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(collections_router, prefix="/collections", tags=["collections"])
app.include_router(cart_router, prefix="/cart", tags=["cart"])
app.include_router(users_router, prefix="/users", tags=["users"])  # Include the user router


@app.get("/")
async def root():
    return {"message": "Hello World"}

