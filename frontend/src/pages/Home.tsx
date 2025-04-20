import React, { useEffect, useState } from 'react';
import { getOnSaleBooks, getFeaturedBooks, getDiscounts } from '../services/api';
import BookCard from '../components/BookCard';
import { Book, Discount } from '../types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../components/ui/select";


const Home: React.FC = () => {
  const [onSaleBooks, setOnSaleBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [sortBy, setSortBy] = useState<'recommended' | 'popular'>('recommended');

  useEffect(() => {

    const fetchOnSaleBooks = async () => {
      try {
        const response = await getOnSaleBooks({ skip: 0, limit: 8 });
        setOnSaleBooks(response.data);
      } catch (error) {
        console.error('Error fetching on-sale books:', error);
      }
    };

    const fetchFeaturedBooks = async () => {
      try {
        const response = await getFeaturedBooks({ skip: 0, limit: 8, sort_by: sortBy });
        setFeaturedBooks(response.data);
      } catch (error) {
        console.error('Error fetching featured books:', error);
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
    fetchOnSaleBooks();
    fetchFeaturedBooks();
    fetchDiscounts();
  }, [sortBy]);

  return (
    <div className="container mx-auto -p-4">
      <div className='p-7'>
        <div className='flex justify-between'>
          <h2 className="text-2xl font-bold mb-4">On Sale</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className='p-15 border-2 border-gray-500'>
          <Carousel className="w-full max-w-screen">
            <CarouselContent className="-ml-1">
              {onSaleBooks.map((book) => (
                <CarouselItem key={book.id} className="pl-1 md:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <BookCard key={book.id} book={book} discounts={discounts} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
        <div className='justify-center'>
          <h2 className="text-2xl font-bold mb-4 mt-8 flex justify-center">Featured Books</h2>
          <Tabs defaultValue="recommended" onValueChange={(value) => setSortBy(value as 'recommended' | 'popular')}>
            <div className='flex justify-center p-2'>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger className={"data-[state=active]:bg-gray-600 data-[state=active]:text-white min-w-70 max-w-90"} value="recommended">Recommended</TabsTrigger>
                <TabsTrigger className={"data-[state=active]:bg-gray-600 data-[state=active]:text-white min-w-70 max-w-90"} value="popular">Popular</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="recommended">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-2 border-gray-500 p-4">
                {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} discounts={discounts} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-2 border-gray-500 p-4">
                {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} discounts={discounts} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
        </div>
      </div>
    </div>
  );
};

export default Home;