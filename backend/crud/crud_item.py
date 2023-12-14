from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

import schemas
from crud.base import CRUDBase
from models.models import Item


class CRUDItem(CRUDBase[Item, schemas.ItemCreate, schemas.ItemUpdate]):
    def create_with_owner(self, db: Session, *, obj_in: schemas.ItemCreate, owner_id: int) -> Item:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Item]:
        return (
            db.query(self.model).filter(Item.owner_id == owner_id).offset(skip).limit(limit).all()
        )


item = CRUDItem(Item)
