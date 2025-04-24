from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List
from ...db.database import get_session
from ...models.author import Author
from ...schemas.author import AuthorCreate, AuthorUpdate, AuthorRead
from ...crud.author import create_author, get_author, get_authors, update_author, delete_author
from ...models.user import User
from ...dependencies.auth import get_current_user

router = APIRouter()
@router.get("/", response_model=List[Author])
async def read_authors(session: Session = Depends(get_session)):
    """Get all authors."""
    authors = get_authors(
        session
    )
    return authors
@router.get("/{author_id}")
async def read_author(author_id: int, session: Session = Depends(get_session)):
    """Get author by ID."""
    author = get_author(session, author_id)
    return author

@router.post("/", response_model=AuthorRead, status_code=status.HTTP_201_CREATED)
async def create_author_endpoint(
    author_create: AuthorCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create author."""
    author = create_author(
        session,
        author_create,
        current_user=current_user
    )
    return author

@router.put("/{author_id}")
async def update_author_by_id(
    author_id: int, 
    author_update: AuthorUpdate,
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
) -> AuthorRead:
    """Update a  author."""
    author = update_author(session, author_id, author_update, current_user)

    return author

@router.delete("/{author_id}")
async def delete_author_by_id(author_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """Delete author by id."""
    delete_author(session, author_id, current_user)
    return {"message": "Author deleted successfully"}