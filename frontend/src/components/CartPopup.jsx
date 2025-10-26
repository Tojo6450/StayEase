import React from 'react';
import { useCart } from '../context/Cartcontext';
import { Link } from 'react-router-dom';

function CartPopup({ isOpen, onClose }) {
  const { cartItems, removeFromCart, loadingCart, cartCount } = useCart();

  if (!isOpen) return null;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.listing?.price || 0) * (item.quantity || 0), 0);
  };

  const formattedTotal = calculateTotal().toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

  return (
    <div
      id="cart-popup"
      className="cart-popup position-fixed bottom-0 end-0 mb-5 me-3 p-3 bg-light border rounded shadow-lg"
      style={{ zIndex: 1040, width: '350px', maxHeight: '450px', overflowY: 'auto', marginBottom: '80px' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <h5 className="mb-0">Your Cart ({cartCount})</h5>
        <button className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>

{loadingCart ? (
    <div className="text-center my-4"><div className="spinner-border spinner-border-sm"></div></div>
) : cartItems.length === 0 ? (
    <p className="text-muted text-center my-4">Your cart is empty.</p>
) : (
    <ul id="cart-items" className="list-group list-group-flush mb-3">
        {cartItems.map((item) => {
            // --- ADD THIS CHECK ---
            if (!item || !item.listing || !item.listing._id) {
                 console.warn("Skipping rendering cart item with missing data:", item);
                 return null; // Don't render this item
            }
            // --- END CHECK ---

            // If the check passes, render the item
            return (
                <li key={item._id || item.listing._id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    {/* ... rest of the li content using item.listing ... */}
                     <div className="d-flex align-items-center flex-grow-1 me-2" style={{ minWidth: 0 }}>
                         <img src={item.listing.image?.url || '/placeholder-image.jpg'} alt={item.listing.title} style={{width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px'}}/>
                        <div style={{ minWidth: 0 }}>
                             <small className='d-block text-truncate fw-bold'>{item.listing.title}</small>
                             <small className="text-muted">{item.quantity} x {(item.listing.price || 0).toLocaleString("en-IN",{style:"currency",currency:"INR", maximumFractionDigits:0})}</small>
                        </div>
                    </div>
                    <button
                         className="btn btn-sm btn-outline-danger flex-shrink-0"
                         onClick={() => removeFromCart(item.listing._id)}
                         title="Remove Item"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                </li>
            );
        })}
    </ul>
)}
       {cartItems.length > 0 && (
            <>
                <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
                    <span>Total:</span>
                    <span>{formattedTotal}</span>
                </div>
                <div className="text-center">
                    <Link to="/checkout" className="btn btn-primary w-100" onClick={onClose}>
                    Proceed to Checkout
                    </Link>
                </div>
            </>
       )}
    </div>
  );
}

export default CartPopup;