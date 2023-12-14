from typing import Union

from sqlmodel import Field, SQLModel


# Shared properties
class TagBase(SQLModel):
    is_active: bool = True
    name: str

    class Config:
        from_attributes = True


# Properties to receive via API on creation
class Tag(TagBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)


class TagOut(TagBase):
    id: int
