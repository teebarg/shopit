from typing import Any, Dict, Optional, Union

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlmodel import select

import crud
import schemas
from crud.base import CRUDBase
from models.product import Collection, Product, ProductOut, Tag


class CRUDProduct(CRUDBase[Product, schemas.ProductCreate, schemas.ProductUpdate]):
    def get_collection_update(self, db: Session, update: dict) -> Optional[list[Collection]]:
        collections: list[Collection] = []
        for i in update.get("collections"):
            if collection := crud.collection.get(db=db, id=i):
                collections.append(collection)

        return collections

    def get_multi(self, db: Session, queries: dict, limit: int, offset: int) -> list[ProductOut]:
        statement = select(Product)
        for key, value in queries.items():
            print(key, value)
            if value and key == "col":
                statement = statement.where(Product.collections.any(Collection.id == value))
            if value and key == "tag":
                statement = statement.where(Product.tags.any(Tag.id == value))
            if value and key == "name":
                statement = statement.where(Product[key].like(f"%{value}%"))
        products = db.exec(statement.offset(offset).limit(limit))

        return [ProductOut(**i.dict(), collections=i.collections, tags=i.tags) for i in products]

    def get(self, db: Session, id: Any) -> Optional[ProductOut]:
        product: ProductOut | None = db.get(Product, id)
        if product:
            product.collections = product.collections
            product.tags = product.tags
        return product

    def create(self, db: Session, product: schemas.ProductCreate) -> Optional[ProductOut]:
        try:
            product_data = Product(
                name=product.name,
                price=product.price,
                image=product.image,
                collections=self.get_collection_update(db=db, update=product.dict()),
                tags=self.get_tag_update(db=db, update=product.dict()),
            )

            res = crud.sync(db=db, update=product_data)
            res.collections = res.collections
            res.tags = res.tags
            return res
        except Exception as e:
            raise e

    def update(
        self, db: Session, *, db_obj: Product, obj_in: Union[schemas.ProductUpdate, Dict[str, Any]]
    ) -> Product:
        try:
            obj_data = jsonable_encoder(db_obj)
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_unset=True)

            for field in obj_data:
                if field in update_data:
                    setattr(db_obj, field, update_data[field])

            db_obj.collections = self.get_collection_update(db=db, update=obj_in.dict())
            db_obj.tags = self.get_tag_update(db=db, update=obj_in.dict())

            return crud.sync(db=db, update=db_obj)
        except Exception as e:
            raise e

    def collection(self, db: Session, *, db_obj: Product, update: list[int]) -> Product:
        try:
            db_obj.collections = self.get_collection_update(db=db, update={"collections": update})
            return crud.sync(db=db, update=db_obj)
        except Exception as e:
            raise e

    def tag(self, db: Session, *, db_obj: Product, update: list[int]) -> Product:
        try:
            db_obj.tags = self.get_tag_update(db=db, update={"tags": update})
            return crud.sync(db=db, update=db_obj)
        except Exception as e:
            raise e

    def get_tag_update(self, db: Session, update: dict) -> Optional[list[Tag]]:
        tags: list[Tag] = []
        for i in update.get("tags"):
            if tag := crud.tag.get(db=db, id=i):
                tags.append(tag)
        return tags


product = CRUDProduct(Product)
