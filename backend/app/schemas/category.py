from sqlmodel import SQLModel
from typing import Optional

class Category(SQLModel):
    id: Optional[int] = None
    category_name: str
    category_desc: Optional[str] = None

class CategoryCreate(Category):
    pass

class CategoryRead(Category):
    id: int