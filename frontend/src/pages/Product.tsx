import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getBookById,
  getAuthorById,
  getDiscountByBookId,
  getReviewsByBookId,
  getRatingsByBookId,
} from "../services/api";
import QuantityInput from "../components/QuantityInput";
import PaginationCustom from "../components/Pagination";
import { Author, Book, Discount, Rating, Review } from "../types";
import { toast } from "sonner";

interface Filters {
  rating: number | null;
}

const Product: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("newest to oldest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [startItem, setStartItem] = useState<number>(0);
  const [endItem, setEndItem] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [book, setBook] = useState<Book>();
  const [author, setAuthors] = useState<Author>();
  const [discount, setDiscounts] = useState<Discount>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filters, setFilters] = useState<Filters>({
    rating: 5,
  });

  const params = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(Number(params.id));
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, []);

  useEffect(() => {
    if (book) {
      const fetchAuthor = async () => {
        try {
          if (book.author_id !== undefined) {
            const response = await getAuthorById(book.author_id);
            setAuthors(response.data);
          }
        } catch (error) {
          console.error("Error fetching authors:", error);
        }
      };
      fetchAuthor();

      const fetchDiscount = async () => {
        try {
          const response = await getDiscountByBookId(book.id);
          setDiscounts(response.data);
        } catch (error) {
          console.error("Error fetching discounts:", error);
        }
      };
      fetchDiscount();

      const fetchReviews = async () => {
        const params = {
          rating: filters.rating,
          sort_by: sortBy,
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        try {
          const response = await getReviewsByBookId(book.id, params);
          setTotalItems(response.data.total);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();

      const fetchRatings = async () => {
        const response = await getRatingsByBookId(book.id);
        setRatings(response.data);
      };
      fetchRatings();
    }
  }, [book]);

  useEffect(() => {
    if (book) {
      const fetchReviews = async () => {
        const params = {
          rating: filters.rating,
          sort_by: sortBy,
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        try {
          const response = await getReviewsByBookId(book.id, params);
          setReviews(response.data.items);
          setStartItem((currentPage - 1) * itemsPerPage + 1);
          setEndItem(Math.min(currentPage * itemsPerPage, totalItems));
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [book, filters, itemsPerPage, currentPage, totalItems, sortBy]);

  // set price to discount price if available
  const price = discount ? discount.discount_price : book?.book_price;
  // count the number of reviews by star rating
  const getReviewCount = (star: number) => {
    const found = ratings.find((r) => r.rating_star === star);
    return found ? found.review_count : 0;
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const MAX_QUANTITY = 8;

    const existingItemIndex = cart.findIndex(
      (item: {
        bookId: number | undefined;
        quantity: number;
        price: number | undefined;
      }) => item.bookId === book?.id
    );

    if (existingItemIndex >= 0) {
      // Book already in cart, update quantity but cap at 8
      const currentQuantity = cart[existingItemIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      if (newQuantity > MAX_QUANTITY) {
        return {
          success: false,
          message: `Cannot add more. Max quantity of ${MAX_QUANTITY} reached for "${book?.book_title}".`,
        };
      }
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      if (quantity > MAX_QUANTITY) {
        return {
          success: false,
          message: `Cannot add ${quantity} items. Max quantity is ${MAX_QUANTITY} for "${book?.book_title}".`,
        };
      }
      cart.push({
        bookId: book?.id,
        quantity: quantity,
        price: book?.book_price,
        bookTitle: book?.book_title,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return { success: true, message: `"${book?.book_title}" added to cart!` };
  };

  const handleAddToCart = () => {
    const result = addToCart();
    if (result.success) {
      toast.success(result.message, {
        duration: 2000, // Auto-dismiss after 2 seconds
      });
    } else {
      toast.error(result.message, {
        duration: 3000, // Auto-dismiss after 3 seconds
      });
    }
  };

  return (
    <div className="container mx-auto p-12">
      <div className="mb-6">
        <h2 className="text-2xl font-medium my-4">Category Name</h2>
        <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
      </div>
      <div className="display grid grid-cols-9 grid-rows-[auto_auto] gap-10">
        <div className="col-span-6">
          <div className="flex flex-row border border-gray-300 rounded-lg shadow-md">
            <div className="flex flex-col w-1/3 text-right">
              {/* TODO: Fix the image onError to handle if the image is not found set image dedfault */}
              <img
                // src={"https://picsum.photos/640/480?random=1"}
                src={
                  book?.book_cover_photo ||
                  "https://picsum.photos/640/480?random=1"
                }
                alt={book?.book_title}
                className="w-full h-68 object-cover rounded"
              />
              <div className="py-4">
                <span>By (author) </span>
                <span className="font-semibold">{author?.author_name}</span>
              </div>
            </div>
            <div className="m-8 w-fit">
              <h2 className="text-2xl font-semibold mb-2">
                {book?.book_title}
              </h2>
              <p className="text-gray-700">{book?.book_summary}</p>
            </div>
          </div>
        </div>
        <div className="col-span-3 col-start-7 flex flex-col h-fit">
          <div className="flex flex-col border border-gray-300 rounded-lg shadow-md py-4 px-4">
            <div className="flex flex-row items-center space-x-1">
              {discount && (
                <span className="text-gray-400 text-lg line-through">
                  ${parseFloat(book?.book_price?.toString() || "0").toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold">
                ${parseFloat(price?.toString() || "0").toFixed(2)}
              </span>
            </div>

            <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
            <div className="my-8">
              <QuantityInput
                className="mt-4"
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={8}
              />
              <button
                className="bg-gray-300 w-full mt-8"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-6 row-start-2 flex flex-col border border-gray-300 rounded-lg shadow-md p-8">
          <div className="space-x-2">
            <label className="text-2xl font-semibold mb-2">
              Customer Reviews
            </label>
            <span className="text-medium text-gray-500">
              {filters.rating &&
                `(Filtered by ${[filters.rating]
                  .filter(Boolean)
                  .join(", ")} star)`}
            </span>
          </div>

          <div className="space-x-4">
            <span className="text-3xl font-bold">4.5</span>
            <span className="text-3xl font-bold">Star</span>
          </div>
          <div className="flex flex-row items-center space-x-4 ">
            {/* TODO: Total numbers will be total records or total items*/}
            <span className="font-semibold underline">({totalItems})</span>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <span key={star}>
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFilters({ ...filters, rating: star })}
                >
                  {star} Star ({getReviewCount(star)})
                </span>
                {index < 4 && <span> | </span>}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <label className="my-4">
              Showing {startItem}-{endItem} of{" "}
              {getReviewCount(filters?.rating ?? 5)} reviews
            </label>
            <div>
              <select
                className="p-2 mr-4 border rounded bg-gray-300"
                defaultValue="onsale"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value)
                }
              >
                {["newest to oldest", "oldest to newest"].map((item) => (
                  <option className="bg-white" value={item} key={item}>
                    Sort by date: {item}
                  </option>
                ))}
              </select>

              <select
                className="p-2 border rounded bg-gray-300"
                defaultValue={20}
                // Set the number of items per page
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setItemsPerPage(Number(e.target.value))
                }
              >
                {[25, 20, 15, 5].map((item) => (
                  <option className="bg-white" value={item} key={item}>
                    Show {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            {reviews.map((review) => (
              <div className="flex flex-col space-y-2 py-2">
                <div className="space-x-2 pb-2">
                  <label className="text-2xl font-semibold">
                    {review.review_title}
                  </label>
                  <span>|</span>
                  {/* TODO: Check if star = 1 change to star not stars */}
                  <span>{review.rating_star} stars</span>
                </div>
                <p>{review.review_details}</p>
                <span className="text-sm">
                  {new Date(review.review_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
              </div>
            ))}
            <div className="my-2">
              <PaginationCustom
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                currentPage={currentPage}
                // Handle page change and set the current page
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row h-fit col-span-3 col-start-7 row-start-2 border border-gray-300 rounded-lg shadow-md">
          4
        </div>
      </div>
    </div>
  );
};

export default Product;
