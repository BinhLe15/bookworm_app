from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class Category(SQLModel, table=True):
    """Category model for the application."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    category_name: str = Field(max_length=120)
    category_desc: Optional[str] = Field(max_length=255)
