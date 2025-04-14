from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ...db.database import get_session
from ...models.category import Category

router = APIRouter()
@router.get("/", response_model=List[Category])
async def get_categories(session: Session = Depends(get_session)):
    """Get all categories."""
    categories = session.exec(select(Category)).all()
    return categories