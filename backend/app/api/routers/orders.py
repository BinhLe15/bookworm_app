from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from ...dependencies.auth import get_current_user
from ...db.database import get_session
from ...models.user import User
from ...schemas.order import OrderRead, OrderCreate, OrderUpdate
from ...crud.order import get_orders, get_order, place_order, update_order, delete_order

router = APIRouter()

@router.get("/")
async def read_orders(session: Session = Depends(get_session), skip: int = 0, limit: int = 10) -> List[OrderRead]:
    """Get all books."""
    orders = get_orders(session)
    return orders

@router.get("/{order_id}")
async def read_order(order_id: int, session: Session = Depends(get_session)) -> OrderRead:
    """Get a book."""
    order = get_order(session, order_id)
    return order

# @router.post("/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
# async def create_oder_endpoint(
#     order_create: OrderCreate, 
#     session: Session = Depends(get_session),
#     current_user: User = Depends(get_current_user)
# ) -> OrderRead:
#     """Create order."""
#     order = create_order(
#         session,
#         order_create,
#         current_user=current_user
#     )
#     return order

@router.post("/", response_model=List[OrderRead], status_code=status.HTTP_201_CREATED)
async def cart_place_order(
    order_create: OrderCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Place order."""
    order = place_order(
        session,
        order_create,
        current_user=current_user
    )
    return order

@router.put("/{order_id}")
async def update_order_by_id(order_id: int, order_update: OrderUpdate, session: Session = Depends(get_session)) -> OrderRead:
    """Update a  order."""
    order = update_order(session, order_id, order_update)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.delete("/{order_id}")
async def delete_order_by_id(order_id: int, session: Session = Depends(get_session)):
    """Delete oder by id."""
    order = delete_order(session, order_id)
    return {"message": "Order deleted successfully"}