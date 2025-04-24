from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from typing import List
from ...db.database import get_session
from ...models.discount import Discount
from ...schemas.discount import DiscountCreate, DiscountUpdate, DiscountRead
from ...crud.discount import create_discount, get_discount, get_discounts, update_discount, delete_discount
from ...models.user import User
from ...dependencies.auth import get_current_user

router = APIRouter()
@router.get("/", response_model=List[Discount])
async def read_discounts(session: Session = Depends(get_session)):
    """Get all discounts."""
    discounts = get_discounts(
        session
    )
    return discounts
@router.get("/{discount_id}", response_model=Discount)
async def read_discount(discount_id: int, session: Session = Depends(get_session)):
    """Get discount by ID."""
    discount = get_discount(session, discount_id)
    return discount

@router.post("/", response_model=DiscountRead, status_code=status.HTTP_201_CREATED)
async def create_discount_endpoint(
    discount_create: DiscountCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create discount."""
    discount = create_discount(
        session,
        discount_create,
        current_user=current_user
    )
    return discount

@router.put("/{discount_id}", response_model=DiscountRead)
async def update_discount_by_id(
    discount_id: int, 
    discount_update: DiscountUpdate,
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
) -> DiscountRead:
    """Update a  discount."""
    discount = update_discount(session, discount_id, discount_update, current_user)

    return discount

@router.delete("/{discount_id}")
async def delete_discount_by_id(discount_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """Delete discount by id."""
    delete_discount(session, discount_id, current_user)
    return {"message": "Discount deleted successfully"}