import { useEffect, useState, ReactNode } from "react";
import { CartContext } from "../context/CartContext";
import { CartItem } from "../types";

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Use localStorage state for fetch newest data
  const updatedCart = [...cartItems];
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Add a ref to track initial render
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, isInitialRender]);

  const addToCart = (
    id: number,
    quantity: number,
    bookTitle: string | undefined,
    bookFinalPrice: number | undefined,
    bookCoverPhoto: string | undefined,
    bookAuthor: string | undefined,
    bookBasePrice: number | undefined
  ) => {
    const MAX_QUANTITY = 8;

    const existingItemIndex = updatedCart.findIndex(
      (item: CartItem) => item.book_id === id
    );

    if (existingItemIndex >= 0) {
      // Book already in cart, update quantity but cap at 8
      const currentQuantity = updatedCart[existingItemIndex].quantity;
      const newQuantity = currentQuantity + quantity;
      if (newQuantity > MAX_QUANTITY) {
        return {
          success: false,
          message: `Cannot add more. Max quantity of ${MAX_QUANTITY} reached for "${bookTitle}".`,
        };
      }
      updatedCart[existingItemIndex].quantity = newQuantity;
    } else {
      if (quantity > MAX_QUANTITY) {
        return {
          success: false,
          message: `Cannot add ${quantity} items. Max quantity is ${MAX_QUANTITY} for "${bookTitle}".`,
        };
      }
      updatedCart.push({
        book_id: id,
        quantity: quantity,
        final_price: bookFinalPrice,
        book_title: bookTitle,
        book_cover_photo: bookCoverPhoto,
        book_author: bookAuthor,
        base_price: bookBasePrice,
      });
    }

    setCartItems(updatedCart);
    return {
      success: true,
      message: `"${bookTitle}" added to cart with quantity is ${quantity}.`,
    };
  };

  const getCartItemCount = () => {
    return cartItems.reduce(
      (total: number, item: { quantity: number }) => total + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, setCartItems, getCartItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;
