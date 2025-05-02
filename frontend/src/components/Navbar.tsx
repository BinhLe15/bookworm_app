import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SignInPopUp } from "../pages/SignIn";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { getCartItemCount } = useCart();

  useEffect(() => {
    const count = getCartItemCount();
    setCartCount(count);
  }, [getCartItemCount]);

  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-center">
      <div className="container flex justify-between items-center w-full">
        <Link to="/">
          <span className="text-2xl font-bold text-white hover:text-gray-400">
            Bookworm
          </span>
        </Link>
        <div className="flex items-center space-x-12">
          <Link to="/">
            <span className="text-lg font-semibold text-white hover:text-gray-400 focus:underline">
              Home
            </span>
          </Link>
          <Link to="/shop">
            <span className="text-lg font-semibold text-white hover:text-gray-400 focus:underline">
              Shop
            </span>
          </Link>
          <Link to="/about">
            <span className="text-lg font-semibold text-white hover:text-gray-400 focus:underline">
              About
            </span>
          </Link>
          <Link to="/cart">
            <span className="text-lg font-semibold text-white hover:text-gray-400 focus:underline">
              Cart ({cartCount})
            </span>
          </Link>
          <div>
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <User />
                      <span>{`${user.first_name} ${user.last_name}`}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:cursor-pointer">
                      <LogOut />
                      <span onClick={logout}>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <span className="text-lg font-semibold text-white hover:text-gray-400">{`${user.first_name} ${user.last_name}`}</span>
              <button onClick={logout}>Sign Out</button> */}
              </>
            ) : (
              <SignInPopUp isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
