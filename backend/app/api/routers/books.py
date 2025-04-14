from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, func, select
from typing import List, Optional
from datetime import date
from ...db.database import get_session
from ...models.book import Book, BookCategory
from ...models.author import Author
from ...models.category import Category
from ...models.discount import Discount
from ...models.review import Review

router = APIRouter()

@router.get("/", response_model=List[Book])
async def get_books(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=25),
    category: Optional[str] = None,
    author: Optional[str] = None,
    rating: Optional[float] = None,
    sort: Optional[str] = "on_sale"
):
    """
    Get a list of books with optional filters and pagination.
    """
    query = select(Book).offset(skip).limit(limit)

    if category:
        query = query.join(Category).where(Category.category_name == category)

    if author:
        query = query.join(Author).where(Author.author_name == author)

    # if rating:
    #     query = query.join(Review).where(Review.rating >= rating)

    # if sort == "on_sale":
    #     query = query.join(Discount).where(Discount.start_date <= date.today()).where(Discount.end_date >= date.today())

    books = session.exec(query).all()
    return books

router.get("/{book_id}", response_model=Book)
async def get_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book