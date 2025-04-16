from typing import List
from sqlmodel import Field, Numeric, SQLModel
from datetime import datetime

class OrderBase(SQLModel): 
    order_date: datetime = Field(default_factory=datetime.now)
    order_amount: float = Field(sa_type=Numeric(8, 2))

class OrderCreate(OrderBase):
    pass

class OrderUpdate(OrderBase):
    user_id: int | None = None

class OrderRead(OrderBase):
    id: int
    user_id: int

class OrderWithItems(OrderRead):
    order_items: List["OrderItemRead"] = []

class OrderItemBase(SQLModel):
    quantity: int
    price: float = Field(sa_type="numeric(5, 2)")

class OrderItemCreate(OrderItemBase):
    book_id: int

class OrderItemRead(OrderItemBase):
    id: int
    order_id: int
    book_id: int
