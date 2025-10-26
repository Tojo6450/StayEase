import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import ProtectedRoute from './utils/ProtectedRoute';

import Home from './pages/Home';
import ListingsPage from './pages/Listing';
import LoginPage from './Auth/SignIn';
import SignupPage from './Auth/SignUp';
import ListingDetailPage from './pages/ListingDetails';
import NewListingPage from './pages/New';
import EditListingPage from './pages/Edit';
import CartPage from './pages/Cart';



function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 my-4">
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/listings/:listingId" element={<ListingDetailPage />} />

          <Route
            path="/listings/new"
            element={
              <ProtectedRoute>
                <NewListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:listingId/edit"
            element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;