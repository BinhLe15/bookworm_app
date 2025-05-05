from typing import List
from sqlmodel import SQLModel

from app.schemas.review import ReviewRead


class ReviewsResponse(SQLModel):
    items: List[ReviewRead]
    total: int