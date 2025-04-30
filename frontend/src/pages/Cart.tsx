import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import defaultImage from "../assets/default.png";
import QuantityInput from "../components/QuantityInput";
import { CartItem } from "../types";

const Cart = () => {
  const { cartItems, setCartItems, getCartItemCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const calculateItemTotal = (item: CartItem) => {
    return (item?.quantity * (item.price || 0)).toFixed(2);
  };

  const updateQuantity = (bookId: number, newQuantity: number) => {
    if (!cartItems) return; // Safety check if cartData is undefined

    // Map over cartData to update the quantity of the matching book
    const updatedCart = cartItems.map((item) =>
      item.book_id === bookId ? { ...item, quantity: newQuantity } : item
    );

    // Update the cartCount state
    setCartItems(updatedCart);

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
    }
  }, []);

  // Fetch cart item count from context
  // and set it to local state
  // This will update the cart count whenever the cart items change
  // or when the component mounts
  useEffect(() => {
    const count = getCartItemCount();
    setCartCount(count);
  }, [getCartItemCount]);

  // Calculate the total price of the cart
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setCartTotal(0);
      return;
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * (item.price || 0);
    }, 0);

    setCartTotal(total);
  }, [cartItems]);

  return (
    <div className="container mx-auto p-12">
      <h2 className="text-2xl font-medium my-4">
        Your cart: {cartCount} items
      </h2>
      <div className="border-btext-2xl font-bold border-b border-gray-300 pb-2" />
      <div className="display grid grid-cols-9 gap-8 mt-6">
        <div className="col-span-6 border border-gray-300 rounded-lg shadow-md py-8 h-fit">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8">Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-32">Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems?.map((item) => (
                <TableRow>
                  <TableCell className="pl-8 flex flex-row items-center">
                    <img
                      src={item?.book_cover_photo || defaultImage}
                      alt="default"
                      className="w-32 h-32"
                    />
                    <div className="flex flex-col ml-4">
                      <label className="text-2xl font-semibold">
                        {item?.book_title || "Book Title"}
                      </label>
                      <span>{item?.book_author || "Book Author"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-2xl font-semibold">
                      ${item?.price}
                    </span>
                  </TableCell>
                  <TableCell>
                    <QuantityInput
                      value={item?.quantity}
                      onChange={(value) => {
                        updateQuantity(item.book_id, value);
                      }}
                      min={1}
                      max={8}
                      inputClassName="w-12"
                    />
                  </TableCell>
                  <TableCell className="w-32">
                    <span className="text-2xl font-semibold">
                      ${calculateItemTotal(item)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="col-span-3 border border-gray-300 rounded-lg shadow-md h-fit">
          <div className="flex flex-col justify-center items-center px-8 py-6">
            <label className="font-semibold">Cart Totals</label>
          </div>
          <div className="border-btext-2xl font-bold border-b border-gray-300" />
          <div className="flex flex-col justify-center items-center px-8 py-10 space-y-8">
            <label className="text-2xl font-bold">
              ${cartTotal.toFixed(2)}
            </label>
            <Button className="w-full !rounded-none">Place order</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
