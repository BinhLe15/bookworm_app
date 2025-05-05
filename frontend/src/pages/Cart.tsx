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
import { placeOrder } from "../services/api";
import { AxiosError } from "axios";
import { SignInPopUp } from "./SignIn";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

interface InvalidItem {
  book_id: number;
  error: string;
}

const Cart = () => {
  const { cartItems, setCartItems, getCartItemCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invalidBooks, setInvalidBooks] = useState<CartItem[]>([]);

  const calculateItemTotal = (item: CartItem) => {
    return (item?.quantity * (item.final_price || 0)).toFixed(2);
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

    // Delete the item if quantity is 0
    if (newQuantity === 0) {
      const filteredCart = updatedCart.filter(
        (item) => item.book_id !== bookId
      );
      setCartItems(filteredCart);
      localStorage.setItem("cart", JSON.stringify(filteredCart));
    }
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      order_date: new Date().toISOString(),
      order_amount: 0,
      items: cartItems.map((item) => ({
        book_id: item.book_id,
        quantity: item.quantity,
        price: Number(item.final_price) || 0,
      })),
    };

    try {
      await placeOrder(orderData);
      // Clear the cart after placing the order
      setCartItems([]);
      localStorage.removeItem("cart");
      // Show success message
      toast.success(
        `Order placed successfully! Total: $${cartTotal.toFixed(2)}`,
        { duration: 1000 }
      );
      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
      ) {
        // Redirect to login page
        console.log("User not authenticated. Redirecting to login...");
        setIsDialogOpen(true);
      } else {
        // Handle item-specific errors
        if (error instanceof AxiosError && error.response?.data) {
          const responseData = error.response.data;
          const cart = localStorage.getItem("cart");

          if (cart) {
            const parsedCart = JSON.parse(cart);
            const newInvalidBooks = [...invalidBooks];
            responseData.detail.invalid_items.forEach(
              (element: InvalidItem) => {
                const errorBook = parsedCart.find(
                  (item: CartItem) => item.book_id === element.book_id
                );
                newInvalidBooks.push(errorBook);
                console.log("Invalid book:", element);
              }
            );
            setInvalidBooks(newInvalidBooks);
            console.log("Updated invalidBooks:", newInvalidBooks);
            toast.error(
              `Unvalid books: ${newInvalidBooks.map(
                (item) => item.book_title
              )}.`,
              {
                duration: 4000,
              }
            );
            // Remove invalid books from the cart
            const updatedCart = parsedCart.filter(
              (item: CartItem) =>
                !newInvalidBooks.some(
                  (invalidBook) => invalidBook.book_id === item.book_id
                )
            );
            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
          }
        }
      }
    }
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
    console.log("cartItems", cartItems);

    const total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * (item.final_price || 0);
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
        <div className="col-span-6 border border-gray-300 rounded-lg shadow-md py-8 h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8">Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-32">Quantity</TableHead>
                <TableHead className="pl-10">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems?.map((item) => (
                <TableRow>
                  <TableCell className="pl-8 flex flex-row items-center whitespace-break-spaces">
                    <a
                      href={`/product/${item.book_id}`}
                      target="_blank"
                      className="flex flex-row items-center"
                    >
                      <img
                        src={item?.book_cover_photo || defaultImage}
                        alt="default"
                        onError={(e) => {
                          e.currentTarget.src = defaultImage;
                        }}
                        className="w-32 h-32"
                      />
                      <div className="flex flex-col ml-4 w-fit">
                        <span className="text-2xl font-semibold overflow-x-auto">
                          {item?.book_title || "Book Title"}
                        </span>
                        <span className="mt-2">
                          {item?.book_author || "Book Author"}
                        </span>
                      </div>
                    </a>
                  </TableCell>
                  <TableCell>
                    <p className="text-2xl font-semibold">
                      ${item?.final_price}
                    </p>
                    {item?.base_price && (
                      <p className="text-lg text-gray-500 line-through">
                        ${item?.base_price}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <QuantityInput
                      value={item?.quantity}
                      onChange={(value) => {
                        updateQuantity(item.book_id, value);
                      }}
                      min={0}
                      max={8}
                      inputClassName="w-12"
                    />
                  </TableCell>
                  <TableCell className="w-32 pl-10">
                    <span className="text-2xl font-semibold">
                      ${calculateItemTotal(item)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="!rounded-none !border-none w-fit"
                      onClick={() => {
                        const updatedCart = cartItems.filter(
                          (cartItem) => cartItem.book_id !== item.book_id
                        );
                        setCartItems(updatedCart);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify(updatedCart)
                        );
                      }}
                    >
                      <XIcon />
                    </Button>
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
            <Button
              className="w-full !rounded-none bg-gray-800"
              onClick={() => {
                handlePlaceOrder();
              }}
            >
              Place order
            </Button>
            <SignInPopUp
              className="hidden"
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              navigatePlace="/cart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
