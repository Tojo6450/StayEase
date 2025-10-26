import React from 'react';
import { useCart } from '../context/Cartcontext';

function CartIcon({ onClick }) {
  const { cartCount } = useCart();

  return (
    <div
      id="cart-icon"
      className="cart-icon position-fixed bottom-0 end-0 m-3 p-3 bg-primary text-white rounded-circle shadow d-flex align-items-center justify-content-center"
      style={{ cursor: 'pointer', zIndex: 1050, width: '60px', height: '60px' }}
      onClick={onClick}
      title="View Cart"
    >
      <i className="bi bi-cart-fill fs-4"></i>
      {cartCount > 0 && (
        <span
          id="cart-count"
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {cartCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </div>
  );
}

export default CartIcon;