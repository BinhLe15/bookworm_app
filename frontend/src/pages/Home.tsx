import React, { useEffect, useState } from 'react';
import { getBooks, getDiscounts } from '../services/api';
import BookCard from '../components/BookCard';
import { Book, Discount } from '../types';
import { skip } from 'node:test';

const Home: React.FC = () => {
  const [onSaleBooks, setOnSaleBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const onSaleResponse = await getBooks({skip: 0, limit: 8, sort: 'on_sale'});
        const featuredResponse = await getBooks({ sort: 'popularity', limit: 8 });
        setOnSaleBooks(onSaleResponse.data);
        setFeaturedBooks(featuredResponse.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const discounts = await getDiscounts();
        setDiscounts(discounts.data);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    fetchBooks();
    fetchDiscounts();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">On Sale</h2>
      <div className='border-5 rounded-lg p-4 shadow-md'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {onSaleBooks.map((book) => (
            <BookCard key={book.id} book={book} discounts={discounts} />
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Featured Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Home;