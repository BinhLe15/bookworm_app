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
    authors?: number;
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
  
  export interface CartItem {
    book_id: number;
    quantity: number;
  }

  export interface FeaturedBooks {
    book_id: number;
    avg_rating: number;
    total_reviews: number;
  }