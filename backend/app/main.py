from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.api.routers.books import router as books_router
from app.api.routers.authors import router as authors_router
from app.api.routers.categories import router as categories_router
from app.api.routers.cart import router as cart_router
from app.api.routers.books import router as books_router
from app.api.routers.authors import router as authors_router
from app.api.routers.categories import router as categories_router
from app.api.routers.cart import router as cart_router
from app.api.v1.auth import router as auth_router
from app.api.routers.discounts import router as discounts_router
from app.core.security import get_password_hash
from app.db.database import create_db_and_tables, engine
from app.models.user import User
from app.core.config import settings
from contextlib import asynccontextmanager


# On startup event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # create the database tables
    create_db_and_tables()

    # create a superuser
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.username == "admin")).first()
        if not existing_user:
            existing_user = User(
                username="admin",
                email=settings.FIRST_SUPERUSER,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                disabled=False,
            )
        session.add(existing_user)
        session.commit()
        session.refresh(existing_user)
    yield
    
app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(books_router, prefix="/api/routers/books", tags=["books"])
app.include_router(authors_router, prefix="/api/routers/authors", tags=["authors"])
app.include_router(categories_router, prefix="/api/routers/categories", tags=["categories"])
app.include_router(cart_router, prefix="/api/routers/cart", tags=["cart"])
app.include_router(discounts_router, prefix="/api/routers/discounts", tags=["discounts"])