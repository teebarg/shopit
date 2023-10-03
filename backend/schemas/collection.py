from pydantic import BaseModel


# Pydantic model for the product
class CollectionCreate(BaseModel):
    name: str


class Collection(CollectionCreate):
    id: str
    name: str
