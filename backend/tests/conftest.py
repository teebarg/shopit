from collections.abc import Generator
from typing import cast

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

# from fastapi import FastAPI
# from fastapi.testclient import TestClient
from sqlmodel import Session

from core.config import settings
from db.engine import engine
from db.init_db import init_db
from deps import get_current_user
from main import app
from models.models import User, UserOut


# @pytest.fixture(scope="session", autouse=True)
@pytest.fixture
def db() -> Generator:
    with Session(engine) as session:
        yield session


# @pytest.fixture(scope="module")
@pytest.fixture
def client(current_user: User) -> Generator:
    with TestClient(app) as c:
        cast(FastAPI, c.app).dependency_overrides[get_current_user] = lambda: current_user
        yield c


@pytest.fixture
def unathenticated_client() -> Generator:
    with TestClient(app) as c:
        cast(FastAPI, c.app).dependency_overrides[get_current_user] = lambda: None
        yield c


# @pytest.fixture(scope="module")
@pytest.fixture
def normal_user_token_headers(client: TestClient) -> dict[str, str]:
    """
    Generate token headers for a normal user.

    Args:
        client (TestClient): The test client.

    Returns:
        dict[str, str]: The token headers.
    """
    auth_token = "testtoken"
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def current_user() -> User:
    """
    Fixture that returns a User object representing the current user.

    Returns:
        User: The current user object.
    """
    return User(id=1, is_active=True, is_superuser=False, is_verified=True)
