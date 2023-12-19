from pydantic import BaseModel


class BaseProduct(BaseModel):
    name: str
    price: float
    image: str = "product-01.jpeg"
    is_active: bool = True
    collections: list[int] = []
    tags: list[int] = []


class Product(BaseProduct):
    id: str


class ProductCreate(BaseProduct):
    pass


class ProductUpdate(BaseProduct):
    pass
