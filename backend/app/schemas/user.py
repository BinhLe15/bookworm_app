from sqlmodel import SQLModel
from typing import Optional

class User(SQLModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    admin: Optional[bool] = None
    
class UserCreate(User):
    password: str
    
class UserRead(User):
    id: int