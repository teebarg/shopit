from pydantic import BaseModel


# Pydantic model for the product
class CollectionBase(BaseModel):
    name: str
    is_active: bool = True


class Collection(CollectionBase):
    pass


class CollectionCreate(CollectionBase):
    pass


class CollectionUpdate(CollectionBase):
    pass
