from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ...db.database import get_session
from ...models.discount import Discount

router = APIRouter()
@router.get("/", response_model=List[Discount])
async def get_discounts(session: Session = Depends(get_session)):
    """Get all authors."""
    discounts = session.exec(select(Discount)).all()
    return discounts
@router.get("/{discount_id}", response_model=Discount)
async def get_author(discount_id: int, session: Session = Depends(get_session)):
    """Get author by ID."""
    author = session.get(Discount, discount_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author