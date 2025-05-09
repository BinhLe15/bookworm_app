export interface Category {
  id: number;
  category_name: string;
  category_desc?: string;
}

export interface Author {
  id: number;
  author_name: string;
  author_bio?: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  admin: boolean;
}

export interface Book {
  id: number;
  book_title: string;
  book_summary?: string;
  book_price: number;
  book_cover_photo?: string;
  category_id?: number;
  author_id?: number;
}

export interface Discount {
  id: number;
  book_id: number;
  discount_start_date: string;
  discount_end_date: string;
  discount_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  order_amount: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
}

export interface Review {
  id: number;
  book_id: number;
  review_title: string;
  review_details?: string;
  review_date: string;
  rating_star: number;
}

export interface Rating {
  rating_star: number;
  review_count: number;
}

export interface CartItem {
  book_id: number;
  quantity: number;
  final_price: number | undefined;
  book_title: string | undefined;
  book_cover_photo: string | undefined;
  book_author: string | undefined;
  base_price: number | undefined;
}

export interface OrderItemCreate {
  quantity: number;
  price: number;
  book_id: number;
}

export interface FeaturedBooks {
  book_id: number;
  avg_rating: number;
  total_reviews: number;
}

export interface BooksResponse {
  items: Book[];
  total: number;
}

export interface ReviewsResponse {
  items: Review[];
  total: number;
}
