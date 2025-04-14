from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class BookCategory(SQLModel, table=True):
    """Link model for Book and Category."""
    
    book_id: Optional[int] = Field(default=None, foreign_key="book.id", primary_key=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id", primary_key=True)

class BookAuthor(SQLModel, table=True):
    """Link model for Book and Author."""
    
    book_id: Optional[int] = Field(default=None, foreign_key="book.id", primary_key=True)
    author_id: Optional[int] = Field(default=None, foreign_key="author.id", primary_key=True)

class Book(SQLModel, table=True):
    """Book model for the application."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    author_id: Optional[int] = Field(default=None, foreign_key="author.id")
    book_title: str = Field(max_length=255)
    book_summary: Optional[str] = Field(default=None)
    book_price: float = Field()
    book_cover_photo: Optional[str] = Field(default=None, max_length=20)


