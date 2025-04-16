"""change book_cover_photo property to max len 100

Revision ID: 0f801f6430fb
Revises: 84900e3c7c2a
Create Date: 2025-04-16 10:16:45.702337

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f801f6430fb'
down_revision: Union[str, None] = '84900e3c7c2a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
