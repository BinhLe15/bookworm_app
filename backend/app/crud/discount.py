from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.user import User as UserModel
from app.models.discount import Discount as DiscountModel
from app.schemas.discount import DiscountCreate, DiscountUpdate

def create_discount(session: Session, discount_create: DiscountCreate, current_user: UserModel):
    """Create a new discount."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to create discount")
    
    db_discount = DiscountModel(**discount_create.model_dump())

    session.add(db_discount)
    session.commit()
    session.refresh(db_discount)
    return db_discount

def get_discount(session: Session, discount_id: int):
    """Get a discount."""
    db_discount = session.get(DiscountModel, discount_id)
    if not db_discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    return db_discount

def get_discounts(session: Session):
    """Get discounts."""
    statement = (
        select(DiscountModel)
    )
    return session.exec(statement).all()

def update_discount(session: Session, discount_id: int, discount_update: DiscountUpdate, current_user: UserModel):
    """Update a discount."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to update discount")

    db_discount = session.get(DiscountModel, discount_id)
    if not db_discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    
    for key, value in discount_update.model_dump(exclude_unset=True).items():
        setattr(db_discount, key, value)
    
    session.add(db_discount)
    session.commit()
    session.refresh(db_discount)
    return db_discount

def delete_discount(session: Session, discount_id: int, current_user: UserModel):
    """Delete a discount."""
    if not current_user.admin:
        raise HTTPException(status_code=400, detail="Need admin permission to delete discount")

    db_discount = session.get(DiscountModel, discount_id)

    if not db_discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    session.delete(db_discount)
    session.commit()
    return db_discount