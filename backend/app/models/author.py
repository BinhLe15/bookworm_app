from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class Author(SQLModel, table=True):
    """Author model for the application."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    author_name: str = Field(max_length=255)
    author_bio: Optional[str]