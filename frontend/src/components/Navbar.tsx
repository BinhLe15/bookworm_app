import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SignInPopUp } from "../pages/SignIn";

const Navbar: React.FC = () => {
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container flex justify-between items-center ">
        <Link to="/" className="text-2xl font-bold">
          Bookworm
        </Link>
        <div className="flex items-center space-x-12">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/cart">Cart(0)</Link>
          {user ? (
            <>
              <span>{`${user.first_name} ${user.last_name}`}</span>
              <button onClick={logout}>Sign Out</button>
            </>
          ) : (
            <SignInPopUp />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
