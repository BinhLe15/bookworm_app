from sqlmodel import Session, and_, or_, select, func, nullslast, SQLModel
from typing import List, Optional
from app.models.book import Book as BookModel
from app.models.review import Review as ReviewModel
from app.models.discount import Discount as DiscountModel
from app.schemas.book import BookCreate, BookUpdate, Book, BookRead
from datetime import date

# TODO: move this to response schema
class BooksResponse(SQLModel):
    items: List[BookRead]
    total: int

def create_book(session: Session, book_create: BookCreate) -> Book:
    """Create a new book."""
    db_book = BookModel(**book_create.model_dump())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def get_book(session: Session, book_id: int) -> Optional[Book]:
    """Get a book by ID."""
    book = session.get(BookModel, book_id)
    if not book:
        return None
    return book

def get_books(
    session: Session, 
    skip: int = 0, 
    limit: int = 20, 
    sort_by: str = "onsale",
    category_id: Optional[int] = None,
    author_id: Optional[int] = None,
    min_rating: Optional[int] = None
) -> List[Book]:
    """Get a list of books with optional filters and pagination."""
    statement = select(BookModel)
    count_statement = select(func.count(BookModel.id).label("total"))

    # Apply all filters conditionally
    if category_id:
        statement = statement.where(BookModel.category_id == category_id)
        count_statement = count_statement.where(BookModel.category_id == category_id)
    
    if author_id:
        statement = statement.where(BookModel.author_id == author_id)
        count_statement = count_statement.where(BookModel.author_id == author_id)

    rating_subquery = None
    if min_rating is not None:
        rating_subquery = (
            select(ReviewModel.book_id, func.avg(ReviewModel.rating_star).label("avg_rating"))
            .group_by(ReviewModel.book_id)
            .having(func.avg(ReviewModel.rating_star) >= min_rating)
            .subquery()
        )
        statement = statement.join(rating_subquery)
        count_statement = count_statement.join(rating_subquery)
    
    if sort_by == "onsale":
        sub_query = (
            select(DiscountModel.book_id, DiscountModel.discount_price)
            .where(or_(
            and_(
                DiscountModel.discount_start_date <= date.today(),
                DiscountModel.discount_end_date >= date.today()
            ),
            DiscountModel.discount_end_date == None
        ))
            .subquery()
        )

        statement = statement.join(sub_query, isouter=True).order_by(nullslast((BookModel.book_price - sub_query.c.discount_price).desc()))
    elif sort_by == "recommended":
        sub_query = (
            select(ReviewModel.book_id, func.avg(ReviewModel.rating_star)
            .label("avg_rating"))
            .group_by(ReviewModel.book_id)
            .subquery()
        )
        statement = statement.join(sub_query, BookModel.id == sub_query.c.book_id).order_by(sub_query.c.avg_rating.desc())
    elif sort_by == "popular":
        sub_query = (
            select(ReviewModel.book_id, func.count(ReviewModel.id)
            .label("total_reviews"))
            .group_by(ReviewModel.book_id)
            .subquery()
        )
        statement = statement.join(sub_query, BookModel.id == sub_query.c.book_id).order_by(sub_query.c.total_reviews.desc())
    elif sort_by in ["price_asc", "price_desc"]:
        # For price sorting, add discount condition to both main query and count
        discount_condition = or_(
            and_(
                DiscountModel.discount_start_date <= date.today(),
                DiscountModel.discount_end_date >= date.today()
            ),
            DiscountModel.discount_end_date == None
        )
        
        # Apply join and condition to both statements
        statement = statement.join(DiscountModel, 
                                  and_(BookModel.id == DiscountModel.book_id, 
                                       discount_condition), 
                                  isouter=True)
        
        # Apply order direction based on sort_by value
        if sort_by == "price_asc":
            statement = statement.order_by(func.coalesce(DiscountModel.discount_price, BookModel.book_price).asc())
        else:  # price_desc
            statement = statement.order_by(func.coalesce(DiscountModel.discount_price, BookModel.book_price).desc())

    # Apply pagination only to the main query after all joins and conditions
    statement = statement.offset(skip).limit(limit)

    books = session.exec(statement).all()

    total_result = session.exec(count_statement).first()

    if not books:
        return BooksResponse(items=[], total=0)
    
    return BooksResponse(items=books, total=total_result)


def update_book(session: Session, book_id: int, book_update: BookUpdate) -> Optional[Book]:
    """Update a book by ID."""
    db_book = session.get(BookModel, book_id)
    if not db_book:
        return None
    for key, value in book_update.model_dump(exclude_unset=True).items():
        setattr(db_book, key, value)
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def delete_book(session: Session, book_id: int) -> Optional[Book]:
    """Delete a book by ID."""
    db_book = session.get(BookModel, book_id)
    if not db_book:
        return None
    session.delete(db_book)
    session.commit()
    return db_book

def get_book_with_details(session: Session, book_id: int) -> Optional[Book]:
    statement = (
        select(BookModel)
        .join(DiscountModel, isouter=True)
        .where(BookModel.id == book_id)
    )
    return session.exec(statement).first()