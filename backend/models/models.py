from typing import Union

from pydantic import EmailStr
from sqlalchemy import String
from sqlmodel import Column, Field, Relationship, SQLModel

from models.base import BaseModel


# Shared properties
class UserBase(BaseModel):
    # email: EmailStr = Field(unique=True, index=True)
    email: EmailStr = Field(sa_column=Column(String))
    is_active: bool = True
    is_superuser: bool = False
    firstname: Union[str, None] = None
    lastname: Union[str, None] = None

    class Config:
        from_attributes = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    pass


class UserCreateOpen(SQLModel):
    email: str
    password: str
    firstname: Union[str, None] = None
    lastname: Union[str, None] = None


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: Union[str, None] = None


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    items: list["Item"] = Relationship(back_populates="owner")


# Properties to return via API, id is always required
class UserOut(UserBase):
    id: int


# Shared properties
class ItemBase(SQLModel):
    title: str
    description: Union[str, None] = None


# Properties to receive on item creation
class ItemCreate(ItemBase):
    title: str


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: Union[str, None] = None


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: Union[int, None] = Field(default=None, primary_key=True)
    title: str
    owner_id: Union[int, None] = Field(
        default=None, foreign_key="user.id", nullable=False
    )
    owner: Union[User, None] = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemOut(ItemBase):
    id: int
