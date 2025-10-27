import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { useCart } from '../context/Cartcontext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchInput.trim();
    navigate(query ? `/listings?search=${encodeURIComponent(query)}` : '/listings');
    setSearchInput('');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  }

  // Common button styling for Explore/Create
  const navButtonStyles = "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 no-underline hover:scale-105 hover:shadow-md";
  const primaryNavButton = `bg-indigo-500 text-white hover:bg-indigo-600 ${navButtonStyles}`;
  const secondaryNavButton = `border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 ${navButtonStyles}`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-purple-200/50 shadow-lg">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">

          {/* Left: Logo and Links */}
          <div className="flex items-center space-x-8">
            <Link
              className="flex items-center text-gray-800 hover:text-purple-600 transition-all duration-300 group no-underline"
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <i className="fa-regular fa-compass text-white text-xl"></i>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">StayEase</span>
            </Link>

            {/* Desktop Nav Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Home link removed */}
              <Link
                className={secondaryNavButton} // Apply button style
                to="/listings"
              >
                Explore
              </Link>
              {user && (
                <Link
                  className={primaryNavButton} // Apply button style
                  to="/listings/new"
                >
                  Create Listing
                </Link>
              )}
            </div>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-grow justify-center px-6 max-w-2xl">
            <form className="w-full" onSubmit={handleSearchSubmit}>
              <div className="relative group">
                <input
                  className="block w-full pl-5 pr-12 py-3 border-2 border-purple-200 rounded-full leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm group-hover:border-purple-300"
                  type="search"
                  name="search"
                  placeholder="Search your dream destination..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-purple-500 hover:text-purple-700 transition-colors duration-300"
                >
                   <i className="fa-solid fa-magnifying-glass text-lg"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Auth and Cart (Desktop) + Mobile Toggler */}
          <div className="flex items-center space-x-4">
             {user && (
                 <Link
                   className="hidden md:flex relative text-gray-700 hover:text-purple-600 p-2 hover:bg-purple-50 rounded-full transition-all duration-300 group no-underline"
                   to="/cart"
                   title="View Cart"
                 >
                   <i className="bi bi-cart text-2xl"></i>
                   {cartCount > 0 && (
                     <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-xs font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                       {cartCount}
                     </span>
                   )}
                 </Link>
             )}

            <div className="hidden md:flex items-center space-x-3">
              {!user ? (
                <>
                  <Link
                    className="px-6 py-2 border-2 border-purple-500 text-purple-600 rounded-full text-base font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 no-underline" // Increased font/padding
                    to="/login"
                  >
                    Log in
                  </Link>
                  <Link
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 no-underline" // Increased font/padding
                    to="/signup"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 no-underline" // Increased font/padding
                >
                  Log out
                </button>
              )}
            </div>

             {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <i className="fa-solid fa-xmark text-2xl"></i>
                ) : (
                  <i className="fa-solid fa-bars text-2xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile Menu */}
      <div
        className={`${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-purple-200/50 bg-white/95 backdrop-blur-lg`}
        id="mobile-menu"
      >
        <div className="px-4 pt-4 pb-3 space-y-2">
          {/* Home link removed */}
          <Link
            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 no-underline"
            to="/listings"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <i className="fa-solid fa-compass w-6 mr-3"></i>
            Explore
          </Link>

          {user && (
            <Link
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 no-underline"
              to="/listings/new"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-plus w-6 mr-3"></i>
              Create Listing
            </Link>
          )}

           {user && (
               <Link
                 className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 flex items-center justify-between no-underline"
                 to="/cart"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 <span>
                   <i className="bi bi-cart w-6 mr-3"></i>
                   Cart
                 </span>
                  {cartCount > 0 && (
                       <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-md">
                           {cartCount}
                       </span>
                  )}
               </Link>
           )}

            {/* Mobile Search */}
           <form className="pt-2 pb-1" onSubmit={handleSearchSubmit}>
               <div className="relative">
                 <input
                   className="block w-full pl-5 pr-12 py-3 border-2 border-purple-200 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                   type="search"
                   name="search"
                   placeholder="Search destinations..."
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                 />
                 <button
                   type="submit"
                   className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-purple-500"
                 >
                   <i className="fa-solid fa-magnifying-glass"></i>
                 </button>
               </div>
           </form>
        </div>

        <div className="pt-4 pb-4 border-t border-purple-200/50">
           <div className="px-4 space-y-2">
             {!user ? (
               <>
                 <Link
                   className="block w-full text-center px-4 py-3 rounded-xl text-lg font-semibold text-purple-600 border-2 border-purple-500 hover:bg-purple-50 transition-all duration-300 no-underline" // Increased font/padding
                   to="/login"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   Log in
                 </Link>
                 <Link
                   className="block w-full text-center px-4 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all duration-300 no-underline" // Increased font/padding
                   to="/signup"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   Sign up
                 </Link>
               </>
             ) : (
               <button
                 onClick={handleLogout}
                 className="block w-full text-center px-4 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg transition-all duration-300 no-underline" // Increased font/padding
               >
                 Log out
               </button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;