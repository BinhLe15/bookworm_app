from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class ReviewBase(SQLModel):
    """Schema for review."""
    review_title: Optional[str] = Field(..., description="Title of the review")
    review_details: str = Field(..., description="Details of the review")
    review_date: datetime = datetime.now()
    rating_star: int = Field(..., description="Star rating from 1 to 5")
class ReviewCreate(ReviewBase):
    """Schema for creating a review."""
    pass

class ReviewUpdate(ReviewBase):
    """Schema for updating a review."""
    pass

class ReviewRead(ReviewBase):
    """Schema for reading a review."""
    id: int
    book_id: int


class RecommendationRead(SQLModel):
    """Schema for reading a review."""
    book_id: int
    avg_rating: Optional[float] = None
    total_reviews: Optional[int] = None