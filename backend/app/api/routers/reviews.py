from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.database import get_session
from ...crud.review import create_review, get_reviews, get_reviews_ratings
from app.schemas.review import ReviewCreate, ReviewRead, RatingRead
from app.schemas.response import ReviewsResponse

router = APIRouter()

@router.post("/{book_id}", response_model=ReviewRead)
async def create_review_by_book_id(review_create: ReviewCreate, book_id: int, session: Session = Depends(get_session)):
    """
    Create a new review for a book.
    """
    review = create_review(session, review_create, book_id)

    return review

@router.get("/{book_id}")
async def get_reviews_by_book_id(book_id: int, rating: int = 5, sort_by: str = "newest to oldest", skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    reviews = get_reviews(session, book_id, rating, sort_by, skip, limit)
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this book")
    return reviews

@router.get("/ratings/{book_id}", response_model=List[RatingRead])
async def get_reviews_ratings_by_book_id(book_id: int, session: Session = Depends(get_session)):
    """
    Get ratings for a book.
    """
    ratings = get_reviews_ratings(session, book_id)
    if not ratings:
        raise HTTPException(status_code=404, detail="No ratings found for this book")
    return ratings