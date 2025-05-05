import axios, { AxiosResponse } from "axios";
import {
  User,
  Book,
  Author,
  Category,
  CartItem,
  Discount,
  Rating,
  BooksResponse,
  ReviewsResponse,
  OrderItemCreate,
} from "../types";

const authapi = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

authapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authapi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// Define API methods
export const login = (
  email: string,
  password: string
): Promise<
  AxiosResponse<{ access_token: string; refresh_token: string; user: User }>
> => authapi.post("/api/routers/auth/login", { username: email, password });

export const refresh = (
  refresh_token: string | null
): Promise<AxiosResponse<{ access_token: string }>> =>
  authapi.post("/api/routers/auth/refresh", { refresh_token });

export const get_me = (): Promise<AxiosResponse<User>> =>
  authapi.get("/api/routers/auth/users/me");

export const getBooks = (
  params: unknown
): Promise<AxiosResponse<BooksResponse>> =>
  api.get("/api/routers/books/", { params });

export const getBookById = (id: number): Promise<AxiosResponse<Book>> =>
  api.get(`/api/routers/books/${id}`);

export const getAuthors = (): Promise<AxiosResponse<Author[]>> =>
  api.get("/api/routers/authors");

export const getAuthorById = (id: number): Promise<AxiosResponse<Author>> =>
  api.get(`/api/routers/authors/${id}`);

export const getCategories = (): Promise<AxiosResponse<Category[]>> =>
  api.get("/api/routers/categories/");

export const addToCart = (item: {
  book_id: number;
  quantity: number;
}): Promise<AxiosResponse> => api.post("/cart/add", item);

export const getCartItems = (): Promise<AxiosResponse<CartItem[]>> =>
  api.get("/cart");

export const getDiscounts = (): Promise<AxiosResponse<Discount[]>> =>
  api.get("/api/routers/discounts/");

export const getDiscountByBookId = (
  book_id: number
): Promise<AxiosResponse<Discount>> =>
  api.get(`/api/routers/discounts/${book_id}`);

export const getReviewsByBookId = (
  book_id: number,
  params: unknown
): Promise<AxiosResponse<ReviewsResponse>> =>
  api.get(`/api/routers/reviews/${book_id}`, { params });

export const getRatingsByBookId = (
  book_id: number
): Promise<AxiosResponse<Rating[]>> =>
  api.get(`/api/routers/reviews/ratings/${book_id}`);

export const addReview = (
  book_id: number,
  params: {
    review_title: string;
    review_details: string;
    review_date: string;
    rating_star: number;
  }
): Promise<AxiosResponse> =>
  api.post(`/api/routers/reviews/${book_id}`, params);

export const placeOrder = (params: {
  order_date: string;
  order_amount: number;
  items: OrderItemCreate[];
}): Promise<AxiosResponse> =>
  authapi.post("/api/routers/orders/", params, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

export default api;
