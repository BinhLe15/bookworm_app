"""delete bookauthor and bookcategories tables

Revision ID: 84900e3c7c2a
Revises: 58368a2a4c01
Create Date: 2025-04-16 09:43:05.014649

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '84900e3c7c2a'
down_revision: Union[str, None] = '58368a2a4c01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
