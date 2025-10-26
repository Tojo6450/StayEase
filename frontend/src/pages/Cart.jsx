// src/pages/CartPage.jsx
import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCart } from '../context/Cartcontext';

function CartPage() {
    const { cartItems, removeFromCart, loadingCart, cartCount, clearCart } = useCart(); // Get clearCart
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Add loading state for button
    const navigate = useNavigate(); // Hook for redirection

    // Calculate cart total and formattedTotal
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = Number(item?.listing?.price) || 0;
            const qty = Number(item?.quantity) || 0;
            return sum + price * qty;
        }, 0);
    };
    const total = calculateTotal();
    const formattedTotal = total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

    // --- ADD THIS HANDLER ---
    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        const success = await clearCart(); // Call clearCart from context
        if (success) {
            // Optional: Redirect after a short delay
            setTimeout(() => {
                 navigate('/listings'); // Redirect to listings page after placing order
            }, 1500); // Wait 1.5 seconds
        } else {
             setIsPlacingOrder(false); // Re-enable button on failure
        }
        // No need to setIsPlacingOrder(false) on success if navigating away
    };
    // --- END ---

    return (
        <div className="container py-5">
            {/* ... (h1, loadingCart, empty cart message) ... */}

            { !loadingCart && cartItems.length > 0 && ( // Ensure cart is loaded and not empty
                <div className="row">
                    {/* Cart Items List */}
                    <div className="col-lg-8 mb-4">
                        {/* ... (ul with list items - no changes needed here) ... */}
                         <ul className="list-group shadow-sm">
                            {cartItems.map((item) => {
                                // ... (li rendering logic) ...
                                if (!item || !item.listing) return null;
                                const itemTotal = (Number(item.listing.price) || 0) * (Number(item.quantity) || 0);
                                const formattedItemTotal = itemTotal.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 });

                                return (
                                    <li key={item._id || item.listing._id} className="list-group-item d-flex align-items-center">
                                         {/* ... (img, title, price, quantity) ... */}
                                         <img
                                            src={item.listing.image?.url || '/placeholder-image.jpg'}
                                            alt={item.listing.title}
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px' }}
                                        />
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1">{item.listing.title}</h5>
                                            <p className="mb-1 text-muted small">
                                                {item.quantity} x {(Number(item.listing.price) || 0).toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 })}
                                            </p>
                                             <p className="mb-0 fw-bold">{formattedItemTotal}</p>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-danger ms-3"
                                            onClick={() => removeFromCart(item.listing._id)}
                                            title="Remove Item"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Cart Summary */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                {/* ... (Order Summary details) ... */}
                                <h5 className="card-title mb-3">Order Summary</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal ({cartCount} items)</span>
    
                                    <span>{formattedTotal}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                                    <span>Total</span>
                                    <span>{formattedTotal}</span>
                                </div>

                                {/* --- RE-ADD BUTTON WITH NEW HANDLER --- */}
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder} // Disable while processing
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Placing Order...
                                        </>
                                    ) : (
                                        'Place Order (Clear Cart)'
                                    )}
                                </button>
                                {/* --- END --- */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;