from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from .author import AuthorRead
from .category import CategoryRead
from .discount import DiscountRead

class Book(SQLModel):
    category_id: int = Field(foreign_key="category.id")
    author_id: int = Field(foreign_key="author.id")
    book_title: Optional[str] = Field(default="Book Title")
    book_price: Optional[float] = Field(default=0)
    book_summary: Optional[str] = Field(default="")
    book_cover_photo: Optional[str] = Field(default="")

class BookCreate(Book):
    """Schema for creating a book."""
    pass

class BookUpdate(SQLModel):
    """Schema for updating a book."""
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    book_title: Optional[str] = None
    book_price: Optional[float] = None
    book_summary: Optional[str] = None
    book_cover_photo: Optional[str] = None

class BookRead(Book):
    id: int
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    avg_rating: Optional[float] = None

class BookReadWithDetails(BookRead):
    authors: List[AuthorRead] = []
    discount: Optional[DiscountRead] = None