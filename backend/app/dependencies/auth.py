from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
import jwt
from sqlmodel import Session, select
from app.core.security import verify_password
from app.models.user import User
from app.db.database import get_session
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_user(email: str, session: Session) -> Optional[User]:
    """Retrieve a user from the database by username."""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
        
async def authenticate_user(email: str, password: str, session: Session = Depends(get_session)) -> Optional[User]:
    """Authenticate a user by username and password."""
    user = await get_user(email, session)
    
    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user(email=email, session=session)
    if user is None:
        raise credentials_exception
    return user