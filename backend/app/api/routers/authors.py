from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ...db.database import get_session
from ...models.author import Author

router = APIRouter()
@router.get("/", response_model=List[Author])
async def get_authors(session: Session = Depends(get_session)):
    """Get all authors."""
    authors = session.exec(select(Author)).all()
    return authors
@router.get("/{author_id}", response_model=Author)
async def get_author(author_id: int, session: Session = Depends(get_session)):
    """Get author by ID."""
    author = session.get(Author, author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author