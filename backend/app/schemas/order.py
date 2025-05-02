from typing import List
from sqlmodel import Field, Numeric, SQLModel
from datetime import datetime

class OrderBase(SQLModel): 
    order_date: datetime
    order_amount: float
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

class OrderCreate(OrderBase):
    items: List["OrderItemCreate"] = []
    pass

class OrderItemRead(OrderItemBase):
    id: int
    order_id: int
    book_id: int
