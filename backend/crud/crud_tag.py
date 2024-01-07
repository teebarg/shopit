import schemas
from crud.base import CRUDBase
from models.product import Tag


class CRUDTag(CRUDBase[Tag, schemas.TagCreate, schemas.TagUpdate]):
    pass


tag = CRUDTag(Tag)
