from sqlmodel import SQLModel
from typing import Optional

class Author(SQLModel):
    author_name: str
    author_bio: Optional[str] = None

class AuthorCreate(Author):
    pass

class AuthorUpdate(Author):
    pass

class AuthorRead(Author):
    id: int