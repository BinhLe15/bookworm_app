from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, BigInteger

class User(SQLModel, table=True):
    """User model for the application."""
    
    id: Optional[int] = Field(sa_type=BigInteger, default=None, primary_key=True)
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(unique=True, default=None, )
    admin: bool = Field(default=False)
    password: str = Field(max_length=255)