import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import {
  getBookById,
  getAuthorById,
  getDiscountByBookId,
  getReviewsByBookId,
  getRatingsByBookId,
  addReview,
} from "../services/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import QuantityInput from "../components/QuantityInput";
import PaginationCustom from "../components/Pagination";
import { Author, Book, Discount, Rating, Review } from "../types";
import { toast } from "sonner";
import { formatNumber } from "../components/FormatNumber";
import { useCart } from "../context/CartContext";
import defaultImage from "../assets/default.png";

// Filter schema
interface Filters {
  rating: number | null;
}

// Zod schema for form validation
const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(120, { message: "Title cannot exceed 120 characters" }),
  detail: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
});

interface FormData {
  title: string;
  detail: string;
  rating: number;
}

const Product = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("newest to oldest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [startItem, setStartItem] = useState<number>(0);
  const [endItem, setEndItem] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [book, setBook] = useState<Book>();
  const [author, setAuthors] = useState<Author>();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [discount, setDiscounts] = useState<Discount>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filters, setFilters] = useState<Filters>({
    rating: null,
  });
  const [refreshReviews, setRefreshReviews] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number | undefined>(undefined);

  const params = useParams();
  const { addToCart } = useCart();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      detail: "",
      rating: 1,
    },
  });
  const onFormSubmit = (data: FormData) => {
    try {
      addReview(Number(params.id), {
        review_title: data.title,
        review_details: data.detail,
        review_date: new Date().toISOString(),
        rating_star: data.rating,
      });
      form.reset();
      // Always reset to page 1 when submitting a new review
      setCurrentPage(1);
      // Force immediate refresh with a small delay to allow server to process
      setTimeout(() => {
        setRefreshReviews((prev) => prev + 1);
        // Ensure we fetch ratings again to update the counts
        fetchRatings();
      }, 300);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleAddToCart = () => {
    const result = addToCart(
      Number(params.id),
      quantity,
      book?.book_title,
      price,
      book?.book_cover_photo,
      author?.author_name,
      basePrice
    );
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

  const fetchRatings = async () => {
    const response = await getRatingsByBookId(Number(params.id));
    setRatings(response.data);
    let avgEachRating = 0;
    let totalReviews = 0;

    // get each rating star and review count in api to calculate avg rating
    response.data.map((rating) => {
      totalReviews += rating.review_count;
      avgEachRating = rating.rating_star * rating.review_count + avgEachRating;
    });
    const average = totalReviews > 0 ? avgEachRating / totalReviews : 0;
    setAvgRating(average);
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(Number(params.id));
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        window.location.href = "/404";
      }
    };
    fetchBook();
  }, [params.id]);

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
          const response = await getDiscountByBookId(Number(params.id));
          setDiscounts(response.data);
          setBasePrice(book?.book_price || 0);
        } catch (error) {
          console.error("Error fetching discounts:", error);
        }
      };

      fetchDiscount();

      fetchRatings();
    }
  }, [book]);

  useEffect(() => {
    if (book) {
      const fetchReviews = async () => {
        const reviewParams = {
          rating: filters.rating,
          sort_by: sortBy,
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        try {
          const response = await getReviewsByBookId(
            Number(params.id),
            reviewParams
          );
          setTotalItems(response.data.total);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();
    }
  }, [book, refreshReviews]);

  useEffect(() => {
    if (book) {
      const fetchReviews = async () => {
        const reviewParams = {
          rating: filters.rating,
          sort_by: sortBy,
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        };
        try {
          const response = await getReviewsByBookId(
            Number(params.id),
            reviewParams
          );
          setReviews(response.data.items);
          setStartItem((currentPage - 1) * itemsPerPage + 1);
          setEndItem(Math.min(currentPage * itemsPerPage, totalItems));
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [
    book,
    filters,
    itemsPerPage,
    currentPage,
    totalItems,
    sortBy,
    refreshReviews,
  ]);

  // Reset the current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // set price to discount price if available
  const price = discount ? discount.discount_price : book?.book_price;
  // count the number of reviews by star rating
  const getReviewCount = (star: number | null) => {
    if (star === null) return totalItems;
    const found = ratings.find((r) => r.rating_star === star);
    return found ? found.review_count : 0;
  };

  return (
    <div className="container mx-auto p-12">
      {/* Desktop view */}
      <div className="hidden md:flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-medium my-4">Category Name</h2>
          <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
        </div>
        <div className="display grid grid-cols-9 grid-rows-[auto_auto] gap-10">
          <div className="col-span-6">
            <div className="flex flex-row border border-gray-300 rounded-lg shadow-md">
              <div className="flex flex-col w-1/3 text-right">
                <img
                  src={book?.book_cover_photo || defaultImage}
                  alt={book?.book_title}
                  className="w-full h-68 object-cover rounded"
                  onError={({ currentTarget }) => {
                    // handle image link error
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = defaultImage;
                  }}
                />
                <div className="py-4 break-words">
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
                    $
                    {parseFloat(book?.book_price?.toString() || "0").toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold">
                  ${parseFloat(price?.toString() || "0").toFixed(2)}
                </span>
              </div>

              <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
              <div className="my-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
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
          <div className="col-span-6 row-start-2 flex flex-col border border-gray-300 rounded-lg shadow-md p-8 h-fit">
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
              <span className="text-3xl font-bold">
                {formatNumber(avgRating)}
              </span>
              <span className="text-3xl font-bold">Star</span>
            </div>
            <div className="flex flex-row items-center space-x-2 ">
              <span
                className="font-semibold underline cursor-pointer pr-2"
                onClick={() => setFilters({ ...filters, rating: null })}
              >
                ({totalItems})
              </span>
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
                {getReviewCount(filters?.rating || null)} reviews
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
                <div className="flex flex-col space-y-2 py-2 break-words">
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
                  totalItems={getReviewCount(filters?.rating || null)} // Total items will be total records or total items
                  currentPage={currentPage}
                  // Handle page change and set the current page
                  onPageChange={(page: number) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row h-fit col-span-3 col-start-7 row-start-2 border border-gray-300 rounded-lg shadow-md">
            {/* TODO: Add required validation for title and detail */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-8 p-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "title">;
                  }) => (
                    <FormItem>
                      <FormLabel>Add a title</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-gray-300 shadow-md"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="detail"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "detail">;
                  }) => (
                    <FormItem>
                      <FormLabel>
                        Details please! Your review helps other shoppers
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="border border-gray-300 shadow-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "rating">;
                  }) => (
                    <FormItem>
                      <FormLabel>Select a rating star</FormLabel>
                      <FormControl>
                        <select
                          className="h-10 border border-gray-300 shadow-md"
                          {...field}
                        >
                          <option value={1}>1 Star</option>
                          <option value={2}>2 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={5}>5 Stars</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-medium my-4">Category Name</h2>
          <div className="border-b border-gray-300 pb-2" />
        </div>

        {/* Book info section */}
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-md mb-6">
          <div className="flex flex-row p-4">
            <img
              src={book?.book_cover_photo || defaultImage}
              alt={book?.book_title}
              className="max-w-[250px] object-cover rounded mb-4 mr-4"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = defaultImage;
              }}
            />
            <div className="flex flex-col w-fit ml-4">
              <h2 className="text-xl font-semibold mb-2">{book?.book_title}</h2>
              <div className="py-2">
                <span>By (author) </span>
                <span className="font-semibold">{author?.author_name}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-700 text-sm">{book?.book_summary}</p>
          </div>
        </div>

        {/* Price and Add to Cart section */}
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-2">
            {discount && (
              <span className="text-gray-400 text-base line-through mr-2">
                ${parseFloat(book?.book_price?.toString() || "0").toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold">
              ${parseFloat(price?.toString() || "0").toFixed(2)}
            </span>
          </div>

          <div className="border-b border-gray-300 pb-2 mb-4" />

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={8}
            className="mb-4"
          />
          <button className="bg-gray-300 w-full py-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>

        {/* Reviews section */}
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold">Customer Reviews</h3>
            {filters.rating && (
              <span className="text-sm text-gray-500 ml-2">
                (Filtered by {filters.rating} star)
              </span>
            )}
          </div>

          <div className="mb-2">
            <span className="text-2xl font-bold">
              {formatNumber(avgRating)}
            </span>
            <span className="text-2xl font-bold ml-2">Star</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="text-sm font-semibold underline cursor-pointer mr-4"
              onClick={() => setFilters({ ...filters, rating: null })}
            >
              All ({totalItems})
            </span>

            {[5, 4, 3, 2, 1].map((star) => (
              <span key={star} className="text-sm mr-4">
                <span
                  className="cursor-pointer underline"
                  onClick={() => setFilters({ ...filters, rating: star })}
                >
                  {star} ({getReviewCount(star)})
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2">
              Showing {startItem}-{endItem} of{" "}
              {getReviewCount(filters?.rating || null)} reviews
            </label>

            <div className="flex flex-row gap-2 space-x-8">
              <select
                className="p-2 borde rounded bg-gray-300 w-fit"
                defaultValue="newest to oldest"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {["newest to oldest", "oldest to newest"].map((item) => (
                  <option className="bg-white" value={item} key={item}>
                    Sort by date: {item}
                  </option>
                ))}
              </select>

              <select
                className="p-2 border rounded bg-gray-300 w-fit"
                defaultValue={20}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
              <div
                key={review.id}
                className="flex flex-col space-y-2 py-2 break-words"
              >
                <div className="flex flex-col pb-2">
                  <span className="text-lg font-semibold">
                    {review.review_title}
                  </span>
                  <span className="text-sm">{review.rating_star} stars</span>
                </div>
                <p className="text-sm">{review.review_details}</p>
                <span className="text-xs">
                  {new Date(review.review_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <div className="border-b border-gray-300 pb-2" />
              </div>
            ))}

            <div className="my-2">
              <PaginationCustom
                itemsPerPage={itemsPerPage}
                totalItems={getReviewCount(filters?.rating || null)}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="flex flex-col border border-gray-300 rounded-lg shadow-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="space-y-6 p-4 w-full"
            >
              <h3 className="text-lg font-semibold">Write a Review</h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add a title</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 shadow-md"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        className="border border-gray-300 shadow-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 border border-gray-300 shadow-md"
                        {...field}
                      >
                        <option value={1}>1 Star</option>
                        <option value={2}>2 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={5}>5 Stars</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Product;
