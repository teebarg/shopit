"""create collection table

Revision ID: f13ded863c4e
Revises: 6408efd24b89
Create Date: 2023-12-10 18:36:47.681685

"""
from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel.sql.sqltypes

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f13ded863c4e"
down_revision: Union[str, None] = "6408efd24b89"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "collection",
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_collection_name"), "collection", ["name"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_collection_name"), table_name="collection")
    op.drop_table("collection")
