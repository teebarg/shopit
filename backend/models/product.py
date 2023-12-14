from typing import Any, Optional, Union

from sqlmodel import Field, Relationship, SQLModel


class ProductCollection(SQLModel, table=True):
    __tablename__ = "product_collection"
    product_id: Optional[int] = Field(default=None, foreign_key="product.id", primary_key=True)
    collection_id: Optional[int] = Field(
        default=None, foreign_key="collection.id", primary_key=True
    )


class ProductTag(SQLModel, table=True):
    __tablename__ = "product_tag"
    product_id: Optional[int] = Field(default=None, foreign_key="product.id", primary_key=True)
    tag_id: Optional[int] = Field(default=None, foreign_key="tag.id", primary_key=True)


class CollectionBase(SQLModel):
    is_active: bool = True
    name: str

    class Config:
        from_attributes = True


class Collection(CollectionBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    products: list["Product"] = Relationship(
        back_populates="collections", link_model=ProductCollection
    )


class CollectionOut(CollectionBase):
    id: int
    products: list["Product"] = []


class TagBase(SQLModel):
    is_active: bool = True
    name: str

    class Config:
        from_attributes = True


# Properties to receive via API on creation
class Tag(TagBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    products: list["Product"] = Relationship(back_populates="tags", link_model=ProductTag)


class TagOut(TagBase):
    id: int
    products: Any = []


# Shared properties
class ProductBase(SQLModel):
    is_active: bool = True
    name: str
    price: float = 0.0
    image: str | None = "product-01.jpeg"


class Product(ProductBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    collections: list[Collection] = Relationship(
        back_populates="products", link_model=ProductCollection
    )
    tags: list[Tag] = Relationship(back_populates="products", link_model=ProductTag)


class ProductOut(ProductBase):
    id: int
    collections: list[Collection] = []
    tags: list[Tag] = []

    # class Config:
    #     from_attributes = True
