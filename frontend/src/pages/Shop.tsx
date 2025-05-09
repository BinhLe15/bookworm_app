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

const Shop = () => {
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

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  return (
    <div className="container mx-auto p-12">
      {/* Desktop view */}
      <div className="hidden md:flex flex-col">
        <h2 className="text-2xl font-medium my-4">
          Books{" "}
          {(filters.category || filters.author || filters.rating) &&
            `(Filtered by ${[filters.category, filters.author, filters.rating]
              .filter(Boolean)
              .join(", ")})`}
        </h2>
        <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
        <div className="flex pt-8">
          <div className="w-1/4 pr-4">
            <h3 className="text-lg font-semibold mb-2">Filter by</h3>
            <div className="border border-gray-300 rounded-lg shadow-sm">
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
                  defaultValue={20}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setItemsPerPage(Number(e.target.value))
                  }
                >
                  <option value={25}>Show 25</option>
                  <option value={20}>Show 20</option>
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
              {/* TODO: Set current page is first page when filters change */}
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
      {/* Mobile view */}
      <div className="md:hidden flex flex-col">
        <h2 className="text-2xl font-medium my-4">
          Books{" "}
          {(filters.category || filters.author || filters.rating) &&
            `(Filtered by ${[filters.category, filters.author, filters.rating]
              .filter(Boolean)
              .join(", ")})`}
        </h2>
        <div className="border-b border-gray-300 pb-2 mb-4" />

        <div className="mb-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="filters">
              <AccordionTrigger className="!no-underline">
                Filters & Sorting
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="category">
                      <AccordionTrigger className="!no-underline text-sm">
                        Category
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 max-h-36 overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
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
                      <AccordionTrigger className="!no-underline text-sm">
                        Author
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 max-h-36 overflow-y-auto">
                          {authors.map((author) => (
                            <button
                              key={author.id}
                              className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
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
                      <AccordionTrigger className="!no-underline text-sm">
                        Minimum Rating
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 max-h-36 overflow-y-auto">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              className="display-block w-full text-left p-1 !font-light !text-sm hover:bg-gray-200"
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

                  <div className="flex flex-row justify-between pt-2">
                    <div className="mb-3">
                      <label className="block mb-1 text-sm pb-4">Sort By</label>
                      <select
                        className="p-2 w-fit border rounded text-sm"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setSort(e.target.value)
                        }
                      >
                        <option value="onsale">On Sale</option>
                        <option value="popular">Popularity</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm pb-4">
                        Items per page
                      </label>
                      <select
                        className="p-2 w-fit border rounded text-sm"
                        defaultValue={20}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setItemsPerPage(Number(e.target.value))
                        }
                      >
                        <option value={25}>Show 25</option>
                        <option value={20}>Show 20</option>
                        <option value={15}>Show 15</option>
                        <option value={5}>Show 5</option>
                      </select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-2 pl-5 text-sm">
          Showing {startItem}-{endItem} of {totalItems}
        </div>

        <div className="grid grid-cols-2 gap-3">
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
  );
};

export default Shop;
