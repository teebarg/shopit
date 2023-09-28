from pydantic import BaseModel


class CartItem(BaseModel):
    product_sku: str
    quantity: int
    product_name: str


class CartItemCreate(BaseModel):
    product_sku: str
    quantity: int


# Pydantic model for the product
class Cart(BaseModel):
    id: str
    items: list[CartItem]
    coverted: bool = False
