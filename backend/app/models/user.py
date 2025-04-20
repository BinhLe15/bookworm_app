from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    """User model for the application."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True, default=None)
    admin: bool = Field(default=False)
    hashed_password: str