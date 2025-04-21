from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class DiscountBase(SQLModel):
    book_id: Optional[int]
    discount_start_date: date
    discount_end_date: date
    discount_price: float

class DiscountCreate(DiscountBase):
    pass

class DiscountUpdate(DiscountBase):
    pass

class DiscountRead(DiscountBase):
    id: int
    discount_price: float