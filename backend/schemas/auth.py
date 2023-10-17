from pydantic import BaseModel


class Social(BaseModel):
    email: str
    firstname: str
    lastname: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "testuser@gmail.com",
                "firstname": "firstname",
                "lastname": "lastname",
            }
        }


class SignIn(BaseModel):
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "testuser@gmail.com",
                "password": "testpassword",
            }
        }


class SignUp(BaseModel):
    email: str
    password: str
    confirmPassword: str
    firstname: str
    lastname: str
    phone: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "testuser@gmail.com",
                "password": "testpassword",
                "confirmPassword": "testpassword",
                "firstname": "firstname",
                "lastname": "lastname",
                "phone": "phone",
            }
        }
