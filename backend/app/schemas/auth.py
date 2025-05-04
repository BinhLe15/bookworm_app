from sqlmodel import SQLModel

from app.schemas.user import UserRead

class Token(SQLModel):
    """Token model for authentication."""
    access_token: str
    token_type: str
    
class TokenData(SQLModel):
    """Token data model."""
    username: str | None = None

class AuthResponse(SQLModel):
    """Authentication response model."""
    access_token: str
    token_type: str
    user: UserRead

class LoginResponse(AuthResponse):
    """Login response model."""
    refresh_token: str

class RefreshResponse(AuthResponse):
    """Refresh response model."""
    pass