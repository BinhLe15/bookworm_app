from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date

class Discount(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    book_id: Optional[int] = Field(foreign_key="book.id")
    discount_start_date: date
    discount_end_date: date
    discount_price: float