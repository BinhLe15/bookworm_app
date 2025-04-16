from sqlmodel import SQLModel
from typing import Optional

class User(SQLModel):
    username: str
    email: Optional[str] = None
    admin: Optional[bool] = None
    
class UserCreate(User):
    password: str
    
class UserRead(User):
    id: int