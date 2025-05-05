from fastapi import HTTPException
from sqlmodel import Session, func, select
from app.models.user import User as UserModel
from app.models.review import Review as ReviewModel
from app.models.book import Book as BookModel
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.schemas.response import ReviewsResponse

def create_review(session: Session, review_create: ReviewCreate, book_id: int):
    """Create a new review."""
    # if not current_user.id:
    #     raise HTTPException(status_code=400, detail="Cannot create review without user")
    book = session.get(BookModel, book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    
    # Validate rating_star (should be 1-5)
    try:
        rating = int(review_create.rating_star)
        if rating < 1 or rating > 5:
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Rating must be a number between 1 and 5")
    
    db_review = ReviewModel(**review_create.model_dump())

    db_review.book_id = book_id

    session.add(db_review)
    session.commit()
    session.refresh(db_review)
    return db_review

def get_review(session: Session, review_id: int):
    """Get a review."""
    review = session.get(ReviewModel, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

def get_reviews(session: Session, book_id: int, rating: int, sort_by: str, skip: int = 0, limit: int = 10):
    """Get reviews by book_id."""
    statement = (
        select(ReviewModel)
        .where(ReviewModel.book_id == book_id)
        .offset(skip)
        .limit(limit)
    )
    count_statement = select(func.count(ReviewModel.id).label("total")).where(ReviewModel.book_id == book_id)
    if rating:
        statement = statement.where(ReviewModel.rating_star == rating)
    if sort_by == "newest to oldest":
        statement = statement.order_by(ReviewModel.review_date.desc())
    elif sort_by == "oldest to newest":
        statement = statement.order_by(ReviewModel.review_date.asc())
    reviews = session.exec(statement).all()
    total_reviews = session.exec(count_statement).one()
    if not reviews:
        return ReviewsResponse(items=[], total=0)
    return ReviewsResponse(items=reviews, total=total_reviews)

def get_reviews_ratings(session: Session, book_id: int):
    """Get ratings by book_id."""
    statement = (
        select(ReviewModel.rating_star, func.count(ReviewModel.book_id).label("review_count"))
        .where(ReviewModel.book_id == book_id)
        .group_by(ReviewModel.rating_star)
    )
    return session.exec(statement).all()

def update_review(session: Session, review_id: int, review_update: ReviewUpdate):
    """Update a review."""
    db_review = session.get(ReviewModel, review_id)
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    for key, value in review_update.model_dump(exclude_unset=True).items():
        setattr(db_review, key, value)
    
    session.add(db_review)
    session.commit()
    session.refresh(db_review)
    return db_review

def delete_review(session: Session, review_id: int):
    """Delete a review."""
    db_review = session.get(ReviewModel, review_id)

    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    session.delete(db_review)
    session.commit()
    return db_review