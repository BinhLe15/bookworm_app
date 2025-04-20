from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class Review(SQLModel):
    """Schema for review."""
    book_id: Optional[int] = Field(foreign_key="book.id")
    review_title: str
    review_details: Optional[str] = None
    review_date: datetime = datetime.now()
    rating_star: int

class ReviewCreate(Review):
    """Schema for creating a review."""
    pass


class RecommendationRead(SQLModel):
    """Schema for reading a review."""
    book_id: int
    avg_rating: Optional[float] = None
    total_reviews: Optional[int] = None