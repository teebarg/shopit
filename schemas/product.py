from pydantic import BaseModel

from .collection import Collection, CollectionCreate


class ProductCreate(BaseModel):
    name: str
    price: float
    collections: list[Collection]  # New field to hold collection IDs


class ProductUpdate(BaseModel):
    name: str
    price: float
    collections: list[Collection]  # New field to hold collection IDs


class Product(BaseModel):
    id: str
    name: str
    price: float
    collections: list[Collection]  # New field to hold collection IDs
