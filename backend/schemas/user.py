from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    uid: str


# Additional properties to return via API
class User(UserBase):
    pass


# Additional properties stored in DB
class UserInDB(UserBase):
    firstname: str
    lastname: str
