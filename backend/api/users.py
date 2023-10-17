from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

import deps
import schemas

# Create a router for users
router = APIRouter()


@router.get("/me", response_model=schemas.UserInDB)
def read_user_me(
    current_user: schemas.UserInDB = Depends(deps.get_current_user),
):
    """
    Get current user.
    """
    return JSONResponse(status_code=200, content={"user": current_user})
