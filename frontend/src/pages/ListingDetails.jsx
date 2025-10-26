import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
// Import child components (to be created)
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import MapComponent from '../components/Map'; // Assuming you create this

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

function ListingDetailPage() {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchListing = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/listings/${listingId}`);
            setListing(response.data);
        } catch (err) {
            console.error("Fetch listing detail error:", err);
            setError(err.response?.data?.message || "Could not load listing details.");
            toast.error(err.response?.data?.message || "Listing not found or error loading.");
            // Optional: Redirect if 404
             if (err.response?.status === 404) {
                 navigate('/listings');
             }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListing();
    }, [listingId]); // Refetch if listingId changes

    const handleDeleteListing = async () => {
        if (!window.confirm('Are you sure you want to delete this listing?')) {
            return;
        }
        try {
            const response = await apiClient.delete(`/listings/${listingId}`);
            if (response.data.success) {
                toast.success('Listing deleted successfully!');
                navigate('/listings');
            }
        } catch (error) {
            console.error('Delete listing error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete listing.');
        }
    };

    // Function to be passed to ReviewForm to refresh reviews after submission
    const handleReviewSubmitted = () => {
        fetchListing(); // Re-fetch the listing data to include the new review
    };
    const handleReviewDeleted = () => {
         fetchListing(); // Re-fetch after deleting a review
    }


    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    if (error || !listing) {
        return <div className="container py-5 text-center text-danger">{error || "Listing not found."}</div>;
    }

    const isOwner = user && listing.owner && user._id === listing.owner._id;
    // Format price
    const formattedPrice = listing.price?.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR", // Change currency code if needed
        minimumFractionDigits: 0,
    });


    return (
        <div className="container py-5">
            <h1 className="text-center text-primary mb-4">{listing.title}</h1>

            <div className="card shadow-sm mx-auto mb-5" style={{ maxWidth: '870px' }}>
                <div className="card-body">
                    {listing.owner?.username && (
                         <p className="card-text text-muted mb-2">Owned by <i>{listing.owner.username}</i></p>
                    )}

                    {listing.image?.url ? (
                        <img
                            src={listing.image.url}
                            alt={listing.title}
                            className="img-fluid rounded mb-4"
                            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
                        />
                    ) : (
                        <p className="text-muted text-center">No image available.</p>
                    )}

                    <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item">
                            <strong>Description:</strong> {listing.description}
                        </li>
                        <li className="list-group-item">
                            <strong>Price:</strong> {formattedPrice} / night
                        </li>
                        <li className="list-group-item">
                            <strong>Location:</strong> {listing.location}
                        </li>
                        <li className="list-group-item">
                            <strong>Country:</strong> {listing.country}
                        </li>
                         {listing.category && (
                              <li className="list-group-item">
                                 <strong>Category:</strong> {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                              </li>
                         )}
                    </ul>

                    {isOwner && (
                        <div className="d-flex justify-content-start gap-2 mb-4">
                            <Link to={`/listings/${listing._id}/edit`} className="btn btn-warning">
                                <i className="bi bi-pencil-square"></i> Edit Listing
                            </Link>
                            <button onClick={handleDeleteListing} className="btn btn-danger">
                                <i className="bi bi-trash"></i> Delete Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="row justify-content-center">
                 <div className="col-lg-8 col-md-10">
                      <hr/>
                      {/* Review Form (Show only if logged in) */}
                      {user && (
                           <div className="mb-4">
                                <h3>Leave a Review</h3>
                                <ReviewForm listingId={listingId} onReviewSubmitted={handleReviewSubmitted} />
                           </div>
                      )}

                      {/* Review List */}
                      <ReviewList reviews={listing.reviews || []} listingId={listingId} currentUserId={user?._id} onReviewDeleted={handleReviewDeleted}/>
                 </div>
            </div>


            {/* Map Section */}
            {listing.geometry?.coordinates && (
                 <div className="row justify-content-center mt-4">
                     <div className="col-lg-8 col-md-10 mb-3">
                          <h3>Where you'll be</h3>
                          <MapComponent coordinates={listing.geometry.coordinates} />
                     </div>
                 </div>
            )}
        </div>
    );
}

export default ListingDetailPage;