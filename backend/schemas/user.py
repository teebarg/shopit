from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    is_superuser: bool = False
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    uid: str


# Properties to receive via API on creation
class UserCreate(UserBase):
    pass


# Properties to receive via API on update
class UserUpdate(UserBase):
    pass


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    pass


class User(UserInDBBase):
    pass
