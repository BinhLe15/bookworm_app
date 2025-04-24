from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.user import User as UserModel
from app.models.author import Author as AuthorModel
from app.schemas.author import AuthorCreate, AuthorUpdate

def create_author(session: Session, author_create: AuthorCreate, current_user: UserModel):
    """Create a new author."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to create author")
    
    db_author = AuthorModel(**author_create.model_dump())

    session.add(db_author)
    session.commit()
    session.refresh(db_author)
    return db_author

def get_author(session: Session, author_id: int):
    """Get a author."""
    db_author = session.get(AuthorModel, author_id)
    if not db_author:
        raise HTTPException(status_code=404, detail="Author not found")
    return db_author

def get_authors(session: Session):
    """Get orders."""
    statement = (
        select(AuthorModel)
    )
    return session.exec(statement).all()

def update_author(session: Session, author_id: int, author_update: AuthorUpdate, current_user: UserModel):
    """Update a author."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to update author")

    db_author = session.get(AuthorModel, author_id)
    if not db_author:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for key, value in author_update.model_dump(exclude_unset=True).items():
        setattr(db_author, key, value)
    
    session.add(db_author)
    session.commit()
    session.refresh(db_author)
    return db_author

def delete_author(session: Session, author_id: int, current_user: UserModel):
    """Delete a order."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to delete author")

    db_author = session.get(AuthorModel, author_id)

    if not db_author:
        raise HTTPException(status_code=404, detail="Author not found")
    session.delete(db_author)
    session.commit()
    return db_author