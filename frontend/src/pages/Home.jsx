
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Home() {
  const { user } = useAuth(); 

  return (
    <>
      <div className="blur-background"></div>

      <section className="text-center py-7 home-section">
        <div className="icon mb-4">
          <i className="fas fa-home fa-3x text-primary"></i>
        </div>
        <h1 className="display-4 mb-3 text-primary">Welcome to StayEase</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Your trusted rental platform. Create, edit, update, delete listings, and leave reviews for perfect stays — all in one place.
        </p>
        <div className="mt-4">
          <Link to="/listings" className="btn btn-primary btn-lg px-4 rounded-pill">
            Explore Listings
          </Link>

          {!user && (
            <Link
              to="/signup"
              className="btn btn-outline-secondary btn-lg px-4 rounded-pill ms-3 text-dark bgg" 
            >
              Join Now
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;