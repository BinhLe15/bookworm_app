import os
import secrets
from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv()

os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    
    SECRET_KEY: str = secrets.token_urlsafe(32)
    FIRST_SUPERUSER: EmailStr 
    FIRST_SUPERUSER_PASSWORD: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 4320
    PROJECT_NAME: str = "FastAPI Project"
    PROJECT_VERSION: str = "0.1.0"
    PROJECT_DESCRIPTION: str = "A FastAPI project"
    DATABASE_URL: str
    
settings = Settings()