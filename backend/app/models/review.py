from sqlmodel import SQLModel, Field
from sqlalchemy import BigInteger, Column, Text
from typing import Optional
from datetime import datetime

class Review(SQLModel, table=True):
    id: Optional[int] = Field(sa_type=BigInteger, default=None, primary_key=True)
    book_id: int = Field(sa_type=BigInteger, foreign_key="book.id")
    review_title: str = Field(max_length=120)
    review_details: Optional[str] = Field(sa_type=Text, default=None)
    review_date: datetime = Field(default_factory=datetime.now())
    rating_star: int = Field(max_length=5)
