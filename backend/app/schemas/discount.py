from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Discount(SQLModel):
    id: Optional[int] = None
    book_id: Optional[int] = Field(foreign_key="book.id")
    discount_start_date: date = Field(default_factory=date.today)
    discount_end_date: date
    discount_price: float

class DiscountCreate(Discount):
    pass

class DiscountRead(Discount):
    id: int
    discount_price: float