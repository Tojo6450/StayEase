
import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/Cartcontext';

function CartPage() {
    const { cartItems, removeFromCart, loadingCart, cartCount, clearCart } = useCart(); 
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); 
    const navigate = useNavigate(); 

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = Number(item?.listing?.price) || 0;
            const qty = Number(item?.quantity) || 0;
            return sum + price * qty;
        }, 0);
    };
    const total = calculateTotal();
    const formattedTotal = total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });


    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        const success = await clearCart();
        if (success) {
            setTimeout(() => {
                 navigate('/listings'); 
            }, 1500); 
        } else {
             setIsPlacingOrder(false); 
        }
    };


    return (
        <div className="container py-5">

            { !loadingCart && cartItems.length > 0 && ( 
                <div className="row">
                    <div className="col-lg-8 mb-4">
                         <ul className="list-group shadow-sm">
                            {cartItems.map((item) => {
                                if (!item || !item.listing) return null;
                                const itemTotal = (Number(item.listing.price) || 0) * (Number(item.quantity) || 0);
                                const formattedItemTotal = itemTotal.toLocaleString("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 });

                                return (
                                    <li key={item._id || item.listing._id} className="list-group-item d-flex align-items-center">
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

                   
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                              
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

                              
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder} 
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
                           
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;