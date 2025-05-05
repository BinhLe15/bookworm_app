import { useEffect, useState } from "react";
import { getDiscounts, getBooks } from "../services/api";
import BookCard from "../components/BookCard";
import { Book, Discount } from "../types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const skip = 0;
const limit = 8;

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [sortBy, setSortBy] = useState<"recommended" | "popular">(
    "recommended"
  );

  useEffect(() => {
    const fetchOnSaleBooks = async () => {
      try {
        const response = await getBooks({
          skip: 0,
          limit: 10,
          sort_by: "onsale",
        });
        setBooks(response.data.items);
      } catch (error) {
        console.error("Error fetching on-sale books:", error);
      }
    };

    fetchOnSaleBooks();

    const fetchFeaturedBooks = async () => {
      try {
        const response = await getBooks({
          skip: skip,
          limit: limit,
          sort_by: sortBy,
        });
        setFeaturedBooks(response.data.items);
      } catch (error) {
        console.error("Error fetching on-sale books:", error);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const discounts = await getDiscounts();
        setDiscounts(discounts.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchFeaturedBooks();
    fetchDiscounts();
  }, [sortBy]);

  return (
    <div className="container mx-auto -p-4">
      <div className="p-7">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">On Sale</h2>
          <Button className="bg-gray-800">
            <Link to="/shop" className="text-white">
              View All
            </Link>
          </Button>
        </div>

        <div className="p-15 border rounded-lg border-gray-300 shadow-sm">
          <Carousel className="w-full max-w-screen">
            <CarouselContent className="-ml-1">
              {books.map((book) => (
                <CarouselItem
                  key={book.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/4"
                >
                  <div className="p-1">
                    <BookCard
                      key={book.id}
                      book={book}
                      discounts={discounts}
                      author_id={book.author_id}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="justify-center">
          <h2 className="text-2xl font-medium mb-4 mt-8 flex justify-center">
            Featured Books
          </h2>
          <Tabs
            defaultValue="recommended"
            onValueChange={(value) =>
              setSortBy(value as "recommended" | "popular")
            }
          >
            <div className="flex justify-center pb-8">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger
                  className={
                    "data-[state=active]:bg-gray-800 data-[state=active]:text-white min-w-70 max-w-90"
                  }
                  value="recommended"
                >
                  Recommended
                </TabsTrigger>
                <TabsTrigger
                  className={
                    "data-[state=active]:bg-gray-800 data-[state=active]:text-white min-w-70 max-w-90"
                  }
                  value="popular"
                >
                  Popular
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recommended">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border rounded-lg border-gray-300 shadow-sm p-4">
                {featuredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    discounts={discounts}
                    author_id={book.author_id}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border rounded-lg border-gray-300 shadow-sm p-4">
                {featuredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    discounts={discounts}
                    author_id={book.author_id}
                  />
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
