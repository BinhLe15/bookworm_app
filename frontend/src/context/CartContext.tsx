import { createContext, useContext } from "react";
import { CartItem } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    id: number,
    quantity: number,
    bookTitle: string | undefined,
    bookPrice: number | undefined,
    bookCoverPhoto: string | undefined,
    bookAuthor: string | undefined
  ) => { success: boolean; message: string };
  setCartItems: (items: CartItem[]) => void;
  getCartItemCount: () => number;
}

// Provide a default value that matches the shape of CartContextType
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => ({ success: false, message: "Context not initialized" }),
  setCartItems: () => {},
  getCartItemCount: () => 0,
});

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
