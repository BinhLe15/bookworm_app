import axios, { AxiosResponse }  from "axios";
import { User, Book, Author, Category, CartItem, Discount } from "../types";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",}
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

// Define API methods
export const login = (email: string, password: string): Promise<AxiosResponse<{ access_token: string; user: User }>> => 
    api.post("/auth/login", { username: email, password });

export const getBooks = (params: unknown): Promise<AxiosResponse<Book[]>> =>
    api.get("/api/routers/books/", { params });

export const getBookById = (id: number): Promise<AxiosResponse<Book>> =>
    api.get(`/books/${id}`);

export const getAuthors = (): Promise<AxiosResponse<Author[]>> =>
    api.get("/authors");

export const getCategories = (): Promise<AxiosResponse<Category[]>> =>
    api.get("/categories");

export const addToCart = (item: { book_id: number; quantity: number }): Promise<AxiosResponse> =>
    api.post("/cart/add", item);

export const getCartItems = (): Promise<AxiosResponse<CartItem[]>> =>
    api.get("/cart");

export const getDiscounts = (): Promise<AxiosResponse<Discount[]>> =>
    api.get("/api/routers/discounts/");

export default api;