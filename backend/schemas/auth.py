from pydantic import BaseModel


class Social(BaseModel):
    email: str
    firstname: str
    lastname: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "test@gmail.com",
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
                "email": "test@gmail.com",
                "password": "password",
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
                "email": "test@gmail.com",
                "password": "password",
                "confirmPassword": "password",
                "firstname": "firstname",
                "lastname": "lastname",
                "phone": "phone",
            }
        }
