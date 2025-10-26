/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './Authcontext';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const { user } = useAuth();

  const fetchCart = useCallback(async (showLoading = false) => {
    if (!user) {
        setCartItems([]);
        setLoadingCart(false);
        return;
    };
    if (showLoading) setLoadingCart(true);
    try {
      const { data } = await apiClient.get('/cart');
      const validItems = (data.items || []).filter(item => item && item.listing && item.listing._id);
      if (validItems.length !== (data.items || []).length) {
          console.warn("Filtered out cart items with missing listing data.");
      }
      setCartItems(validItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
       if (showLoading) toast.error("Could not load cart.");
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("CartContext useEffect triggered by user change...");
    fetchCart();
  }, [user, fetchCart]);

  const addToCart = async (listingId) => {
    if (!user) return toast.error("Please log in first.");
    console.log(`Context: Attempting to add listingId ${listingId} to cart.`);
    try {
        const response = await apiClient.post('/cart', { listingId });
        console.log('Context: Add to cart API response:', response.data);

        if (response.data.success) {
            toast.success(response.data.message || 'Added to cart!');

            const newItem = response.data.item;
            setCartItems(prevItems => {
                const existingIndex = prevItems.findIndex(item => item.listing?._id?.toString() === newItem.listing?._id?.toString());
                if (existingIndex > -1) {
                    const updatedItems = [...prevItems];
                    updatedItems[existingIndex] = newItem;
                    return updatedItems;
                } else {
                    return [...prevItems, newItem];
                }
            });

        } else {
            toast.error(response.data.message || 'Could not add item.');
        }
    } catch (error) {
        console.error("Context: Failed to add to cart:", error);
        toast.error(error.response?.data?.message || 'Failed to add item.');
    }
  };

   const removeFromCart = useCallback(async (listingId) => {
      if (!user) return;
      console.log(`Context: Attempting to remove listingId ${listingId} from cart.`);
      try {
         const response = await apiClient.delete(`/cart/${listingId}`);
         console.log('Context: Remove from cart API response:', response.data);
         if (response.data.success) {
              toast.success(response.data.message || 'Removed from cart.');
              setCartItems(prev => prev.filter(item => item.listing?._id?.toString() !== listingId.toString()));
         } else {
              toast.error(response.data.message || 'Could not remove item.');
         }
      } catch (error) {
         console.error("Context: Failed to remove from cart:", error);
         toast.error(error.response?.data?.message || 'Failed to remove item.');
         fetchCart(true);
      }
   }, [user, fetchCart]);

   const clearCart = async () => {
        if (!user) return; 
        console.log("Context: Attempting to clear cart.");
        try {
            const response = await apiClient.delete('/cart'); 
            console.log("Context: Clear cart response:", response.data);
            if (response.data.success) {
                setCartItems([]);
                toast.success(response.data.message || 'Order Placed! Cart Cleared.');
                return true; 
            } else {
                toast.error(response.data.message || 'Could not clear cart.');
                return false; // Indicate failure
            }
        } catch (error) {
            console.error("Context: Failed to clear cart:", error);
            toast.error(error.response?.data?.message || 'Failed to clear cart.');
            return false; // Indicate failure
        }
    };

  const isInCart = (listingId) => {
    if (!listingId) return false;
    return cartItems.some(item =>
        item &&
        item.listing &&
        item.listing._id?.toString() === listingId.toString()
    );
  };

  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);

  useEffect(() => {
       console.log("Cart items state updated:", cartItems);
   }, [cartItems]);

  const value = {
    cartItems,
    cartCount,
    loadingCart,
    addToCart,
    removeFromCart,
    fetchCart,
    clearCart,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};