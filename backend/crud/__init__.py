from typing import Any, Dict, Union

from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select

import schemas
from models.models import User, UserCreate

from .crud_collection import collection
from .crud_item import item
from .crud_product import product
from .crud_tag import tag
from .crud_user import user

# For a new basic set of CRUD operations you could just do


def get_user_by_email(*, db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.exec(statement).first()


def update_or_create_user(
    *,
    db: Session,
    obj_in: Union[schemas.UserUpdate, Dict[str, Any]],
    email: str,
) -> User:
    update_data = {}
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)

    if model := db.exec(select(User).where(User.email == email)).first():
        obj_data = jsonable_encoder(model)
        for field in obj_data:
            if field in update_data:
                setattr(model, field, update_data[field])
    else:
        # If the record doesn't exist, create a new record
        update_data["email"] = email
        model = User(**update_data)
        db.add(model)

    db.commit()
    db.refresh(model)
    return model
