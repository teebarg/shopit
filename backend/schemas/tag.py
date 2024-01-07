from pydantic import BaseModel


class BaseTag(BaseModel):
    name: str
    is_active: bool = True


class Tag(BaseTag):
    id: str


class TagCreate(BaseTag):
    pass


class TagUpdate(BaseTag):
    pass
