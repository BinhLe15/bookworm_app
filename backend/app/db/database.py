from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

# I don't know why if I not import those models it will not generate the tables
from app.models.order import Order, OrderItem

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create the database and tables on startup."""
    # SQLModel.metadata.create_all(engine)
    print("Database and tables created successfully.")
    
def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session