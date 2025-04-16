import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Discount } from '../types';
import defaultImage from '../assets/default.png'

interface BookCardProps {
  book: Book;
  discounts?: Discount [];
}

const BookCard: React.FC<BookCardProps> = ({ book, discounts }) => {
  const activeDiscount = discounts?.find(
    (discount) =>
      discount.book_id === book.id &&
      new Date(discount.discount_start_date) <= new Date() &&
      new Date(discount.discount_end_date) >= new Date()
  );
  const price: number = activeDiscount ? activeDiscount.discount_price : book.book_price;

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <Link to={`/product/${book.id}`}>
        <img   
          src={book.book_cover_photo || defaultImage}
          alt={book.book_title}
          className="w-full h-68 object-cover rounded"
        />
        <h3 className="text-lg font-semibold mt-2">{book.book_title}</h3>
        <p className='text-gray-600'>${price.toFixed(2)}</p>
        {/* <p className="text-gray-600">${price.toFixed(2)}</p> */}
        {activeDiscount && (
          <p className="text-red-500 line-through">${book.book_price.toFixed(2)}</p>
        )}
      </Link>
    </div>
  );
};

export default BookCard;