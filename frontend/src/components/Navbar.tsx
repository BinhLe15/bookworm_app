import { useEffect, useState } from "react";
import {
  LogOut,
  User,
  Menu,
  X,
  House,
  ShoppingBag,
  ShoppingCart,
  Info,
} from "lucide-react";
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
import logo from "../assets/bookworm-logo.png";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const count = getCartItemCount();
    setCartCount(count);
  }, [getCartItemCount]);

  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-center z-999">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Bookworm Logo"
            className="h-8 w-8 inline-block mr-2"
          />
          <span className="text-2xl font-bold text-white hover:text-gray-400">
            BOOKWORM
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-12">
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
              </>
            ) : (
              <SignInPopUp isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 p-4 md:hidden z-100">
          {user ? (
            <>
              <div className="flex space-x-2 py-4">
                <User color="white" />
                <span className="text-white text-lg font-medium">{`${user.first_name} ${user.last_name}`}</span>
              </div>
            </>
          ) : (
            ""
          )}
          <Link to="/" onClick={toggleMobileMenu}>
            <span className="text-lg font-semibold text-white hover:text-gray-400 focus:underline flex items-center">
              <House color="white" className="mr-2" />
              Home
            </span>
          </Link>
          <Link to="/shop" onClick={toggleMobileMenu}>
            <span className="flex items-center text-lg font-semibold text-white hover:text-gray-400 focus:underline pt-4">
              <ShoppingBag color="white" className="mr-2" />
              Shop
            </span>
          </Link>
          <Link to="/about" onClick={toggleMobileMenu}>
            <span className="flex items-center text-lg font-semibold text-white hover:text-gray-400 focus:underline pt-4">
              <Info color="white" className="mr-2" />
              About
            </span>
          </Link>
          <Link to="/cart" onClick={toggleMobileMenu}>
            <span className="flex items-center text-lg font-semibold text-white hover:text-gray-400 focus:underline pt-4">
              <ShoppingCart color="white" className="mr-2" />
              Cart ({cartCount})
            </span>
          </Link>
          <div>
            {user ? (
              <div className="flex items-center space-x-2 py-4">
                <LogOut color="white" />
                <span
                  className="text-white text-lg font-medium"
                  onClick={logout}
                >
                  Sign out
                </span>
              </div>
            ) : (
              <div className="py-4">
                <SignInPopUp
                  isOpen={isDialogOpen}
                  setIsOpen={setIsDialogOpen}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
