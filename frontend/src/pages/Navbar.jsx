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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
    
          <div className="flex items-center space-x-6">
            <Link className="flex items-center text-gray-800 hover:text-blue-600" to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fa-regular fa-compass mr-2 text-xl"></i>
              <span className="font-bold text-lg">StayEase</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link className="text-gray-600 hover:text-gray-900" to="/">Home</Link>
              <Link className="text-gray-600 hover:text-gray-900" to="/listings">Explore</Link>
              {user && (
                <Link className="text-gray-600 hover:text-gray-900" to="/listings/new">Create Listing</Link>
              )}
            </div>
          </div>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-grow justify-center px-4">
            <form className="w-full max-w-sm" onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  type="search"
                  name="search"
                  placeholder="Search destination..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600"
                >
                   <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Auth and Cart (Desktop) + Mobile Toggler */}
          <div className="flex items-center space-x-3">
             {user && (
                 <Link className="hidden md:block relative text-gray-600 hover:text-gray-900 p-1" to="/cart" title="View Cart">
                   <i className="bi bi-cart text-xl"></i>
                   {cartCount > 0 && (
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                       {cartCount}
                     </span>
                   )}
                 </Link>
             )}
            <div className="hidden md:flex items-center space-x-2">
              {!user ? (
                <>
                  <Link className="px-3 py-1 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50" to="/login">
                    Log in
                  </Link>
                  <Link className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600" to="/signup">
                    Sign up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
                  Log out
                </button>
              )}
            </div>
             {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <i className="fa-solid fa-xmark h-6 w-6"></i> // Close icon
                ) : (
                  <i className="fa-solid fa-bars h-6 w-6"></i> // Bars icon
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" to="/listings" onClick={() => setIsMobileMenuOpen(false)}>Explore</Link>
          {user && (
            <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" to="/listings/new" onClick={() => setIsMobileMenuOpen(false)}>Create Listing</Link>
          )}
           {user && (
               <Link className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 relative" to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                   Cart
                    {cartCount > 0 && (
                       <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                           {cartCount}
                       </span>
                   )}
               </Link>
           )}
           {/* Mobile Search */}
           <form className="px-3 pt-2" onSubmit={handleSearchSubmit}>
               <input
                 className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 type="search" name="search" placeholder="Search..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
               />
           </form>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
           <div className="px-2 space-y-1">
             {!user ? (
               <>
                 <Link className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                 <Link className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
               </>
             ) : (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Log out</button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;