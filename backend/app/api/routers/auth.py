from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Form, HTTPException, Request, status, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from app.core.config import settings
from app.core.security import create_access_token, verify_password, create_refresh_token
from app.dependencies.auth import authenticate_user, get_current_user, get_user
from sqlmodel import Session
from app.db.database import get_session
from app.models.user import User
from app.schemas.auth import LoginResponse, RefreshResponse

router = APIRouter()

@router.post("/login")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    session: Session = Depends(get_session)   
):
    """Authenticate user and return JWT token."""
    user = await authenticate_user(form_data.username, form_data.password, session)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_refresh_token(
        data={"sub": user.email}, expires_delta=refresh_token_expires
    )

    return LoginResponse(access_token=access_token, refresh_token=refresh_token, token_type="bearer", user=user)
    

@router.post("/refresh")
async def refresh_access_token(
    request: Request,
    response: Response,
    refresh_token: str = Form(...),
    session: Session = Depends(get_session)
):
    # refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")
    
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user = await get_user(user_email, session)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    new_access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return RefreshResponse(
        access_token=new_access_token,
        token_type="bearer",
        user=user
    )

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    print(current_user)
    return current_user