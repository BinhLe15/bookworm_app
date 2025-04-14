from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: Optional[int] = Field(default=None, foreign_key="book.id")
    review_title: str = Field(max_length=120)
    review_details: Optional[str] = Field(default=None)
    review_date: datetime = Field(default_factory=datetime.now())
    rating_start: str = Field(max_length=255)
