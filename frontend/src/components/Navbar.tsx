import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const Navbar: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('Navbar must be used within AuthProvider and CartProvider');
    }

    const { user, logout } = authContext;
    return (
        <nav className='bg-gray-800 p-4'>
            <div className="container mx-auto flex justify-between items-center">
                <Link to='/' className='text-black font-bold text-xl'>
                    Bookworm
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                    <Link to="/shop" className="text-white hover:text-gray-300">Shop</Link>
                    <Link to="/about" className="text-white hover:text-gray-300">About</Link>
                    {user ? (
                        <>
                        <span className="text-white">{`${user.first_name} ${user.last_name}`}</span>
                        <button onClick={logout} className="text-white hover:text-gray-300">
                            Sign Out
                        </button>
                        </>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-300">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;