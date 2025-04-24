from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlmodel import Session
from ...db.database import get_session
from ...models.book import Book
from ...schemas.book import BookCreate, BookUpdate
from ...crud.book import create_book, get_book, get_books, update_book, delete_book
from enum import Enum

class SortBy(str, Enum):
    """Enum for sorting options."""
    recommended = "recommended"
    popular = "popular"
    onsale = "onsale"
    price_asc = "price_asc"
    price_desc = "price_desc"

router = APIRouter()

@router.get("/")
async def read_books(
    response: Response,
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    sort_by: SortBy = Query(SortBy.recommended),
    category_id: int = Query(None),
    author_id: int = Query(None),
    min_rating: int = Query(None)
):
    """
    Get a list of books with optional filters and pagination.
    """
    books = get_books(
        session,
        skip,
        limit,
        sort_by,
        category_id,
        author_id,
        min_rating
    )
    if not books:
        raise HTTPException(status_code=404, detail="No books found")

    return books

@router.get("/{book_id}", response_model=Book)
async def read_book(book_id: int, session: Session = Depends(get_session)):
    """Get a book by ID."""
    book = get_book(session, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/{book_id}", response_model=Book, status_code=status.HTTP_201_CREATED)
async def create_book_by_id(book_create: BookCreate, session: Session = Depends(get_session)):
    """
    Create a new book.
    """
    book = create_book(
        session,
        book_create=book_create
    )
    return book

@router.put("/books")
async def update_book_by_id(
    book_update: BookUpdate,
    book_id: int,
    session: Session = Depends(get_session),
    
):
    """
    Create a new book.
    """
    book = update_book(
        session,
        book_id=book_id,
        book_update=book_update
    )
    return "Book updated successfully"

@router.delete("/{book_id}")
async def delete_book_by_id(book_id: int, session: Session = Depends(get_session)):
    """
    Delete a book by ID.
    """
    book = delete_book(
        session,
        book_id=book_id
    )
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return "Book deleted successfully"