"""create tag table

Revision ID: 83f76162688c
Revises: f13ded863c4e
Create Date: 2023-12-10 18:37:10.698826

"""
from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel.sql.sqltypes

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "83f76162688c"
down_revision: Union[str, None] = "f13ded863c4e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "tag",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tag_name"), "tag", ["name"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_tag_name"), table_name="tag")
    op.drop_table("tag")
