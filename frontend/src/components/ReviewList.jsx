import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/Authcontext' // Adjust path if needed

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    withCredentials: true,
});

function ReviewList({ reviews, listingId, onReviewDeleted }) {
    const { user } = useAuth(); 

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await apiClient.delete(`/listings/${listingId}/reviews/${reviewId}`);

            if (response.data.success) {
                toast.success('Review deleted successfully!');
                if (onReviewDeleted) {
                    onReviewDeleted();
                }
            } else {
                 toast.error(response.data.message || 'Could not delete review.');
            }
        } catch (error) {
            console.error('Delete review error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete review.');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={`bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
            );
        }
        return stars;
    };


    return (
        <div className="mt-4">
            <h4>Reviews ({reviews.length})</h4>
            {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to leave one!</p>
            ) : (
                <div className="row g-3">
                    {reviews.map((review) => {
                         const isAuthor = user && review.author && review.author._id === user._id;

                         return (
                            <div className="col-12 col-md-6" key={review._id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body">
                                        <h6 className="card-title mb-1">
                                            @{review.author?.username || 'Anonymous'}
                                        </h6>
                                        <div className="mb-2">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="card-text mb-2">{review.comment}</p>
                                        <small className="text-muted">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </small>

                                        {isAuthor && (
                                            <>
                                                <hr className="my-2"/>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    title="Delete this review"
                                                >
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            )}
        </div>
    );
}

export default ReviewList;