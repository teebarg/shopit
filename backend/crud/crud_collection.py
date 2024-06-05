import schemas
from crud.base import CRUDBase
from models.product import Collection


class CRUDCollection(
    CRUDBase[Collection, schemas.CollectionCreate, schemas.CollectionUpdate]
):
    pass


collection = CRUDCollection(Collection)
