from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.user import User as UserModel
from app.models.order import Order as OrderModel
from app.models.book import Book as BookModel
from app.models.discount import Discount as DiscountModel
from app.schemas.order import OrderCreate, OrderUpdate
from app.models.order import OrderItem

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

def place_order(session: Session, order_create: OrderCreate, current_user: UserModel):
    """Place an order."""
    invalid_items = []
    # Validate user
    if not current_user.id:
        raise HTTPException(status_code=400, detail="Stay logged in to place an order")
    
    # Calculate total amount and prepare order items
    total_amount = 0.0
    order_create.order_date = datetime.now()

    for item in order_create.items:
        book = session.get(BookModel, item.book_id)
        if not book:
            invalid_items.append({
                "book_id": item.book_id,
                "error": f"Book with id {item.book_id} not found"
            })
            continue  # Skip this item but continue checking others
        
        discount = session.exec(
            select(DiscountModel)
            .where(DiscountModel.book_id == item.book_id, 
                   DiscountModel.discount_start_date <= datetime.now(),
                   (DiscountModel.discount_end_date == None) | 
                   (DiscountModel.discount_end_date >= datetime.now())
            )
        ).first()

        # Use discounted price if available, otherwise use regular price
        price = float(discount.discount_price) if discount else float(book.book_price)
        item_total = item.quantity * price
        total_amount += item_total

    # If any items are invalid, raise exception with all errors
    if invalid_items:
        raise HTTPException(
            status_code=400, 
            detail={
                "message": "Some items in your order are invalid",
                "invalid_items": invalid_items
            }
        )

    # Create new order
    new_order = OrderModel(
        user_id=current_user.id,
        order_date=order_create.order_date,
        order_amount=total_amount
    )
    session.add(new_order)
    session.flush()

    for item in order_create.items:
        book = session.get(BookModel, item.book_id)
        if not book:
            raise HTTPException(status_code=404, detail=f"Book with id {item.book_id} not found")
        
        discount = session.exec(
            select(DiscountModel)
            .where(DiscountModel.book_id == item.book_id, 
                   DiscountModel.discount_start_date <= datetime.now(),
                   (DiscountModel.discount_end_date == None) | 
                   (DiscountModel.discount_end_date >= datetime.now())
            )
        ).first()

        # Use discounted price if available, otherwise use regular price
        price = float(discount.discount_price) if discount else float(book.book_price)
        order_item = OrderItem(
            order_id=new_order.id,
            book_id=item.book_id,
            quantity=item.quantity,
            price=price
        )
        session.add(order_item)
    
    session.commit()
    
    return new_order