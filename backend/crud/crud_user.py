from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

import schemas
from crud.base import CRUDBase
from models.models import User


class CRUDUser(CRUDBase[User, schemas.UserCreate, schemas.UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def update(
        self,
        db: Session,
        *,
        db_obj: User,
        obj_in: Union[schemas.UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
