import asyncio
from faker import Faker
import random
from sqlmodel import Session, SQLModel
from app.db.database import engine
from app.models.book import Book
from app.models.user import User
from app.models.review import Review
from datetime import datetime
from passlib.context import CryptContext

from app.models.category import Category
from app.models.author import Author
from app.models.discount import Discount


async def populate_db():
    fake = Faker()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    with Session(engine) as session:
        # Create Users
        # users = []
        # for _ in range(30):
        #     user = User(
        #         username=fake.user_name(),
        #         email=fake.email(),
        #         hashed_password=pwd_context.hash("password123"),
        #         admin=False,
        #     )
        #     users.append(user)
        #     session.add(user)
        # session.commit()
        # print(f"Created {len(users)} users")

        # # Create categories
        # categories = []
        # for _ in range(15):
        #     category = Category(
        #         category_name=fake.word(),
        #         category_desc=fake.sentence(nb_words=6),
        #     )
        #     categories.append(category)
        #     session.add(category)
        # session.commit()
        # print(f"Created {len(categories)} categories")

        # # Create Authors
        # authors = []
        # for _ in range(50):
        #     author = Author(
        #         author_name=fake.name(),
        #         author_bio=fake.paragraph(nb_sentences=3),
        #     )
        #     authors.append(author)
        #     session.add(author)
        # session.commit()
        # print(f"Created {len(authors)} authors")

        # # Create Books
        # books = []
        # for _ in range(200):
        #     book = Book(
        #         category_id=random.choice(categories).id,
        #         author_id=random.choice(authors).id,
        #         book_title=fake.sentence(nb_words=3),
        #         book_summary=fake.paragraph(nb_sentences=2),
        #         book_price=round(random.uniform(10.0, 100.0), 2),
        #         book_cover_photo=fake.image_url(width=640, height=480),
        #     )
        #     session.add(book)
        #     books.append(book)
        # session.commit()
        # print(f"Created {len(books)} books: ")

        # # Create Discounts
        # for _ in range(20):
        #     discount = Discount(
        #         book_id=fake.unique.random_int(min=1, max=200),
        #         discount_price=round(random.uniform(5.0, 90.0), 2),
        #         discount_start_date=fake.past_datetime(start_date=datetime.now(), tzinfo=None),
        #         discount_end_date=fake.future_datetime(),
        #     )
        #     session.add(discount)
        # session.commit()
        # print(f"Created {20} discounts")

        # Create Reviews
        reviews = []
        for _ in range(200):
            review = Review(
                book_id=random.randint(1, 200),
                review_title=fake.sentence(nb_words=3),
                review_details=fake.paragraph(nb_sentences=2),
                review_date=fake.date_time_this_decade(),
                rating_star=random.randint(1, 5)
            )
            reviews.append(review)
            session.add(review)
        session.commit()
        print(f"Created {len(reviews)} reviews")


if __name__ == "__main__":
    # Initialize database and populate it
    asyncio.run(populate_db())