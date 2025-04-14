from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, SQLModel
from typing import Dict, List
from pydantic import BaseModel
from ...db.database import get_session
from ...models.book import Book
from ...models.user import User
from ...dependencies.auth import get_current_user

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# In-memory cart storage (for demo purposes; use a database in production)
user_carts: Dict[int, List[Dict]] = {}

class CartItem(SQLModel):
    book_id: int
    quantity: int

@router.post("/add", response_model=None)
async def add_to_cart(
    item: CartItem,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    book = session.get(Book, item.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if item.quantity < 1 or item.quantity > 8:
        raise HTTPException(status_code=400, detail="Quantity must be between 1 and 8")
    

    # Get current user
    user = await get_current_user(token, session)
    if not user:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    # Initialize cart for user if not exists
    if user.id not in user_carts:
        user_carts[user.id] = []

    # Check if book is already in cart
    for cart_item in user_carts[user.id]:
        if cart_item["book_id"] == item.book_id:
            cart_item["quantity"] += item.quantity
            if cart_item["quantity"] > 8:
                raise HTTPException(status_code=400, detail="Total quantity cannot exceed 8")
            return {"msg": "Updated cart"}

    # Add new item to cart
    user_carts[user.id].append({"book_id": item.book_id, "quantity": item.quantity, "book": book})
    return {"msg": "Added to cart"}
    
@router.get("/")
async def get_cart(user: User = Depends(get_current_user)):
    return user_carts.get(user.id, [])
