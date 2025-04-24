from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.user import User as UserModel
from app.models.order import Order as OrderModel
from app.schemas.order import OrderCreate, OrderUpdate

def create_order(session: Session, order_create: OrderCreate, current_user: UserModel):
    """Create a new order."""
    if not current_user.id:
        raise HTTPException(status_code=400, detail="Cannot create order without user")
    
    db_order = OrderModel(**order_create.model_dump())

    db_order.user_id = current_user.id

    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order

def get_order(session: Session, order_id: int):
    """Get a order."""
    order = session.get(OrderModel, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

def get_orders(session: Session, skip: int = 0, limit: int = 10):
    """Get orders."""
    statement = (
        select(OrderModel)
        .offset(skip)
        .limit(limit)
    )
    return session.exec(statement).all()

def update_order(session: Session, order_id: int, order_update: OrderUpdate):
    """Update a order."""
    db_order = session.get(OrderModel, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for key, value in order_update.model_dump(exclude_unset=True).items():
        setattr(db_order, key, value)
    
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order

def delete_order(session: Session, order_id: int):
    """Delete a order."""
    db_order = session.get(OrderModel, order_id)

    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(db_order)
    session.commit()
    return db_order