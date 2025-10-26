import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { useCart } from '../context/Cartcontext';
import { toast } from 'react-toastify';

function ListingCard({ listing, showTaxes }) {
  const { user } = useAuth();
  const { addToCart, isInCart, loadingCart } = useCart(); // Added loadingCart

  // Ensure price is treated as a number
  const price = Number(listing.price) || 0;
  const displayPrice = showTaxes ? (price * 1.18) : price;
  const formattedPrice = displayPrice.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR", // Ensure this matches your listing currency
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

  // Re-check isInCart whenever cartItems might change (via context update)
  const itemInCart = isInCart(listing._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Add to cart clicked for listing: ${listing._id}. In cart: ${itemInCart}`); // Log 1

    if (!user) {
      toast.error('Please log in to add items to the cart.');
      return;
    }
    if (!itemInCart) {
         console.log('Calling addToCart function...'); // Log 2
         addToCart(listing._id); // Call the function from context
    } else {
         console.log('Item already in cart, doing nothing.'); // Log 3
         toast.info("Item is already in your cart.");
    }
  };

  return (
    <div className="listing-card card shadow-sm h-100" data-id={listing._id}>
      <div className="image-container" style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={listing.image?.url || '/placeholder-image.jpg'}
          alt={listing.title}
          className="listing-image card-img-top"
          style={{ objectFit: 'cover', height: '100%', width: '100%' }}
        />
        {/* Only render button if user exists */}
        {user && (
            <button
              className={`cart-icon-btn btn ${itemInCart ? 'btn-success' : 'btn-outline-light'}`}
              onClick={handleAddToCart}
              data-id={listing._id}
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, borderRadius: '50%', padding: '0.3rem 0.5rem' }}
              title={itemInCart ? "Item in Cart" : "Add to Cart"}
              // Disable button only when the cart state specifically indicates it's in cart OR while loading cart
              disabled={itemInCart || loadingCart}
            >
             {/* Show spinner if loading? Optional */}
             <i className={`bi ${itemInCart ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
            </button>
        )}
      </div>
      <div className="listing-details card-body d-flex flex-column">
        <h5 className="card-title listing-title flex-grow-1">
          <Link to={`/listings/${listing._id}`} className="text-decoration-none text-dark">
            {listing.title || "Untitled Listing"}
          </Link>
        </h5>
        <p className="listing-location card-text text-muted small mb-1">
          {listing.location || "Unknown Location"}, {listing.country || ""}
        </p>
        <p className="listing-price card-text fw-bold mb-0">
          {formattedPrice} / night {' '}
          <i className="tax-info small fw-normal" style={{ display: showTaxes ? 'inline' : 'none' }}>
             (incl. taxes)
          </i>
           <i className="tax-info small fw-normal" style={{ display: !showTaxes ? 'inline' : 'none' }}>
             (+ taxes)
          </i>
        </p>
      </div>
    </div>
  );
}

export default ListingCard;