from sqlmodel import SQLModel

class Token(SQLModel):
    """Token model for authentication."""
    
    access_token: str
    token_type: str
    
class TokenData(SQLModel):
    """Token data model."""
    
    username: str | None = None