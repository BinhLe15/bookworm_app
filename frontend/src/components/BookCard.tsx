import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Author, Book, Discount } from "../types";
import { getAuthors } from "../services/api";
import defaultImage from "../assets/default.png";

interface BookCardProps {
  book: Book;
  discounts?: Discount[];
  author_id?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookCard: React.FC<BookCardProps> = ({ book, discounts, author_id }) => {
  const [author, setAuthors] = React.useState<Author>();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await getAuthors();
        setAuthors(
          response.data.find((author: Author) => author.id === book.author_id)
        );
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchAuthors();
  }, []);
  const activeDiscount = discounts?.find(
    (discount) => discount.book_id === book.id
  );
  const price: number = activeDiscount
    ? activeDiscount.discount_price
    : book.book_price;

  return (
    <div className="border rounded-lg m-4 shadow-md hover:shadow-lg transition">
      <Link to={`/product/${book.id}`}>
        <img
          src={book?.book_cover_photo || defaultImage}
          alt={book.book_title}
          onError={({ currentTarget }) => {
            // handle image link error
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultImage;
          }}
          className="w-full h-68 object-cover rounded"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mt-2 overflow-hidden truncate">
            {book.book_title}
          </h3>
          <h5 className="text-sm mt-2">{author?.author_name}</h5>
        </div>

        <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
        <div className="flex flex-row items-center p-4 space-x-1">
          {activeDiscount && (
            // Convert to string and then to float to avoid "0.00" book.book_price}
            <p className="text-gray-400 line-through">
              ${parseFloat(book.book_price.toString()).toFixed(2)}
            </p>
          )}
          <p className="text-lg text-black font-bold">
            ${parseFloat(price.toString()).toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
