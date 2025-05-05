import React, { useState, useEffect } from "react";
import {
  getBooks,
  getCategories,
  getAuthors,
  getDiscounts,
} from "../services/api";
import BookCard from "../components/BookCard";
import { Book, Category, Author, Discount } from "../types";
import PaginationCustom from "../components/Pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

interface Filters {
  category: string;
  author: string;
  rating: string;
  category_id: number | null;
  author_id: number | null;
  min_rating: number | null;
}

const Shop: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    author: "",
    rating: "",
    category_id: null,
    author_id: null,
    min_rating: null,
  });
  const [sort, setSort] = useState<string>("onsale");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [startItem, setStartItem] = useState<number>(0);
  const [endItem, setEndItem] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const categoriesResponse = await getCategories();
        const authorsResponse = await getAuthors();
        setCategories(categoriesResponse.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          sort_by: sort,
          category_id: filters.category_id,
          author_id: filters.author_id,
          min_rating: filters.min_rating,
        };
        const response = await getBooks(params);
        setBooks(response.data.items);
        setTotalItems(response.data.total);
        setStartItem((currentPage - 1) * itemsPerPage + 1);
        setEndItem(Math.min(currentPage * itemsPerPage, response.data.total));
      } catch (error) {
        console.error("Error fetching books:", error);
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

    fetchDiscounts();

    fetchBooks();
  }, [currentPage, filters, sort, itemsPerPage]);

  return (
    <div className="container mx-auto p-12">
      <h2 className="text-2xl font-medium my-4">
        Books{" "}
        {(filters.category || filters.author || filters.rating) &&
          `(Filtered by ${[filters.category, filters.author, filters.rating]
            .filter(Boolean)
            .join(", ")})`}
      </h2>
      <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2"></div>
      <div className="flex">
        <div className="w-1/4 pr-4">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["category", "author", "rating"]}
          >
            <AccordionItem value="category">
              <AccordionTrigger className="!no-underline">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
                      value={category.category_name}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          category: category.category_name,
                          category_id: category.id,
                        })
                      }
                    >
                      {category.category_name}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="author">
              <AccordionTrigger className="!no-underline">
                Author
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {authors.map((author) => (
                    <button
                      className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
                      value={author.author_name}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          author: author.author_name,
                          author_id: author.id,
                        })
                      }
                    >
                      {author.author_name}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rating">
              <AccordionTrigger className="!no-underline">
                Minimum Rating
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
                      value={rating}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          rating: rating.toString(),
                          min_rating: rating,
                        })
                      }
                    >
                      {rating} Star
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-3/4">
          <div className="mb-4 flex items-center justify-between">
            <label className="mr-2">
              Showing {startItem}-{endItem} of {totalItems}
            </label>

            <div>
              <label className="mr-2">Sort By:</label>
              <select
                className="p-2 mr-4 border rounded"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSort(e.target.value)
                }
              >
                <option value="onsale">On Sale</option>
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>

              <select
                className="p-2 border rounded"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setItemsPerPage(Number(e.target.value))
                }
              >
                <option value={20}>Show 20</option>
                <option value={25}>Show 25</option>
                <option value={15}>Show 15</option>
                <option value={5}>Show 5</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                discounts={discounts}
                author_id={book.author_id}
              />
            ))}
          </div>
          <div className="mt-4">
            <PaginationCustom
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              currentPage={currentPage}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
