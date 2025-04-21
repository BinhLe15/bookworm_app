from decimal import Decimal
from sqlmodel import Numeric, SQLModel, Field
from typing import Optional
from sqlalchemy import BigInteger, SmallInteger, Column
from datetime import datetime


class Order(SQLModel, table=True):
    id: Optional[int] = Field(sa_type=BigInteger, default=None, primary_key=True)
    user_id: Optional[int] = Field(foreign_key="user.id")
    order_date: datetime = Field(default_factory=datetime.now)
    order_amount: Decimal = Field(sa_type=Numeric(8, 2))

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(sa_type=BigInteger, default=None, primary_key=True)
    order_id: Optional[int] = Field(sa_type=BigInteger, foreign_key="order.id")
    book_id: Optional[int] = Field(sa_type=BigInteger, foreign_key="book.id")
    quantity: int = Field(sa_type=SmallInteger)
    price: Decimal = Field(sa_type=Numeric(5, 2))