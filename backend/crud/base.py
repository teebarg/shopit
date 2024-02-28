from datetime import datetime
from typing import Any, Dict, Generic, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlmodel import select

ModelType = TypeVar("ModelType", bound=Any)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get_multi(
        self,
        db: Session,
        queries: dict,
        per_page: int,
        offset: int,
        sort: str = "desc",
    ) -> list[ModelType]:
        statement = select(self.model)
        for key, value in queries.items():
            if value and key == "name":
                statement = statement.where(self.model.name.like(f"%{value}%"))
            if sort == "desc":
                statement = statement.order_by(self.model.created_at.desc())
        return db.exec(statement.offset(offset).limit(per_page))

    def all(self, db: Session) -> list[ModelType]:
        return db.query(self.model)

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.get(self.model, id)

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # type: ignore
        return self.sync(db=db, update=db_obj)

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        return self.sync(db=db, update=db_obj, type="update")

    def update_or_create(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
        column_name: str,
        column_value: str,
        model_type: Type[ModelType],
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        if model := db.exec(
            select(db_obj).where(getattr(db_obj, column_name) == column_value)
        ).first():
            # If the record exists, update the existing record
            for key, value in update_data.items():
                setattr(model, key, value)
        else:
            # If the record doesn't exist, create a new record
            update_data[column_name] = column_value
            model = model_type(**update_data)
            db.add(model)

        db.commit()
        db.refresh(model)
        return model

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj

    def sync(self, db: Session, update: Any, type: str = "create") -> Any:
        update.updated_at = datetime.now()
        if type == "create":
            update.created_at = datetime.now()
        db.add(update)
        db.commit()
        db.refresh(update)
        return update
