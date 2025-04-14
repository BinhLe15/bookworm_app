from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(foreign_key="user.id")
    order_date: datetime = Field(default_factory=datetime.now())
    order_amount: float = Field()
    items: List["OrderItem"] = Relationship(back_populates="order")

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(foreign_key="order.id")
    book_id: Optional[int] = Field(foreign_key="book.id")
    quantity: int
    price: float
    
    order: "Order" = Relationship(back_populates="items")