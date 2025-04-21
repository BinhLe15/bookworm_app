from decimal import Decimal
from sqlmodel import Numeric, SQLModel, Field
from sqlalchemy import BigInteger, Text
from typing import Optional

from app.models.discount import Discount

class Book(SQLModel, table=True):
    """Book model for the application."""
    
    id: Optional[int] = Field(sa_type=BigInteger, primary_key=True, default=None)
    category_id: Optional[int] = Field(sa_type=BigInteger, default=None, foreign_key="category.id")
    author_id: int = Field(sa_type=BigInteger, foreign_key="author.id")
    book_title: str = Field(max_length=255)
    book_summary: Optional[str] = Field(sa_type=Text, default=None)
    book_price: Decimal = Field(sa_type=Numeric(5, 2))
    book_cover_photo: Optional[str] = Field(default=None, max_length=100)


