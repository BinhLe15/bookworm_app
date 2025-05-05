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
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SignInPopUp } from "./SignIn";
import { useCart } from "../context/CartContext";
import logo from "../assets/bookworm-logo.png";

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const count = getCartItemCount();
    setCartCount(count);
  }, [getCartItemCount]);

  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to determine if a link is active
  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "text-lg font-semibold text-white underline underline-offset-4 hover:text-gray-400"
      : "text-lg font-normal text-white hover:text-gray-400";
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
            <span className={getLinkClass("/")}>Home</span>
          </Link>
          <Link to="/shop">
            <span className={getLinkClass("/shop")}>Shop</span>
          </Link>
          <Link to="/about">
            <span className={getLinkClass("/about")}>About</span>
          </Link>
          <Link to="/cart">
            <span className={getLinkClass("/cart")}>Cart ({cartCount})</span>
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
        <div className="absolute top-16 left-0 w-full h-screen bg-gray-800 py-6 px-6 md:hidden z-50 overflow-y-auto">
          <div>
            {user ? (
              <div className="flex items-center gap-3 px-2 py-4 mb-4 bg-gray-700 rounded-lg">
                <User className="text-white" />
                <span className="text-white text-lg font-medium truncate">{`${user.first_name} ${user.last_name}`}</span>
              </div>
            ) : (
              <div className="px-2 py-4 mb-4">
                <SignInPopUp
                  isOpen={isDialogOpen}
                  setIsOpen={setIsDialogOpen}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className={`${
                location.pathname === "/" ? "bg-gray-700" : ""
              } flex items-center rounded-md p-3 transition-colors`}
            >
              <House className="mr-3 text-white" size={20} />
              <span className="text-lg font-medium text-white">Home</span>
            </Link>

            <Link
              to="/shop"
              onClick={toggleMobileMenu}
              className={`${
                location.pathname === "/shop" ? "bg-gray-700" : ""
              } flex items-center rounded-md p-3 transition-colors`}
            >
              <ShoppingBag className="mr-3 text-white" size={20} />
              <span className="text-lg font-medium text-white">Shop</span>
            </Link>

            <Link
              to="/about"
              onClick={toggleMobileMenu}
              className={`${
                location.pathname === "/about" ? "bg-gray-700" : ""
              } flex items-center rounded-md p-3 transition-colors`}
            >
              <Info className="mr-3 text-white" size={20} />
              <span className="text-lg font-medium text-white">About</span>
            </Link>

            <Link
              to="/cart"
              onClick={toggleMobileMenu}
              className={`${
                location.pathname === "/cart" ? "bg-gray-700" : ""
              } flex items-center rounded-md p-3 transition-colors`}
            >
              <ShoppingCart className="mr-3 text-white" size={20} />
              <span className="text-lg font-medium text-white">
                Cart ({cartCount})
              </span>
            </Link>

            {user && (
              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="flex items-center rounded-md p-3 mt-4 text-left bg-gray-700"
              >
                <LogOut className="mr-3 text-white" size={20} />
                <span className="text-lg font-medium text-white">Sign out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
