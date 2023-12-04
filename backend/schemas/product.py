from pydantic import BaseModel

from .collection import Collection


class BaseProduct(BaseModel):
    name: str
    price: float
    image: str = "product-01.jpeg"
    collections: list[Collection] = []
    tags: list[str] = []


class Product(BaseProduct):
    id: str


class DBProduct(BaseProduct):
    id: str
    tags: list[str] = []


class ProductCreate(BaseProduct):
    tags: list[str] = []


class ProductUpdate(BaseProduct):
    tags: list[str] = []
