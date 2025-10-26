import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/Filterbar';
import CartIcon from '../components/CartIcon';
import CartPopup from '../components/CartPopup';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaxes, setShowTaxes] = useState(false);
  const [searchParams] = useSearchParams();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;

        const response = await apiClient.get('/listings', { params });
        setListings(response.data);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError("Could not load listings. Please try again later.");
      }
      setLoading(false);
    };

    fetchListings();
  }, [searchParams]);

  const handleTaxToggle = (event) => {
    setShowTaxes(event.target.checked);
  };

  const toggleCartPopup = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="container mt-4">
      <FilterBar />

      <div className="tax-toggle d-flex justify-content-center my-3">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="taxSwitch"
            checked={showTaxes}
            onChange={handleTaxToggle}
          />
          <label className="form-check-label" htmlFor="taxSwitch">
            Display total price (incl. 18% tax)
          </label>
        </div>
      </div>

      {loading && (
          <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      )}
      {error && <p className="text-center text-danger mt-3">{error}</p>}

      {!loading && !error && (
        listings.length === 0 ? (
             <p className='text-center text-muted mt-5'>No listings found matching your criteria.</p>
        ) : (
             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 listings-container mb-5">
                {listings.map((listing) => (
                 <div className="col" key={listing._id}>
                   <ListingCard listing={listing} showTaxes={showTaxes} />
                 </div>
                ))}
            </div>
        )
      )}

      <CartIcon onClick={toggleCartPopup} />
      <CartPopup isOpen={isCartOpen} onClose={toggleCartPopup} />
    </div>
  );
}

export default ListingsPage;
