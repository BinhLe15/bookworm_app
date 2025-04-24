from decimal import Decimal
from sqlmodel import Numeric, SQLModel, Field
from sqlalchemy import BigInteger
from typing import Optional
from datetime import date

class Discount(SQLModel, table=True):
    id: Optional[int] = Field(sa_type=BigInteger, primary_key=True, default=None)
    book_id: Optional[int] = Field(sa_type=BigInteger, foreign_key="book.id")
    discount_start_date: date
    discount_end_date: Optional[date] = None
    discount_price: Decimal = Field(sa_type=Numeric(5, 2))