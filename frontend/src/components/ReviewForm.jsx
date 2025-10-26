import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

function ReviewForm({ listingId, onReviewSubmitted }) {
    const [rating, setRating] = useState(0); // Initial rating state
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value, 10));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false || rating === 0) {
            event.stopPropagation();
            if (rating === 0) toast.error("Please select a rating.");
            setValidated(true);
            return;
        }

        setLoading(true);
        setValidated(true);

        try {
            const response = await apiClient.post(`/listings/${listingId}/reviews`, {
                review: { rating, comment } // Match backend expected structure
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Review submitted successfully!');
                setRating(0); // Reset form
                setComment('');
                setValidated(false);
                if (onReviewSubmitted) {
                    onReviewSubmitted(); // Notify parent component to refresh reviews
                }
            }
        } catch (error) {
            console.error('Submit review error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review.');
        } finally {
            setLoading(false);
        }
    };

    // Basic star rating component (or use a library like react-star-ratings)
    const StarRating = () => {
        return (
            <div className="mb-3">
                <label className="form-label d-block">Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                    <React.Fragment key={star}>
                        <input
                            type="radio"
                            id={`rate${star}`}
                            name="rating" // Changed from review[rating]
                            value={star}
                            checked={rating === star}
                            onChange={handleRatingChange}
                            required
                            className="btn-check" // Bootstrap hidden radio
                        />
                        <label
                            htmlFor={`rate${star}`}
                            className={`btn btn-outline-warning me-1 ${rating >= star ? 'active' : ''}`}
                            title={`${star} star${star > 1 ? 's' : ''}`}
                        >
                            <i className={`bi ${rating >= star ? 'bi-star-fill' : 'bi-star'}`}></i>
                        </label>
                    </React.Fragment>
                ))}
                 <input type="radio" name="rating" value={rating} required style={{ opacity: 0, position: 'absolute', pointerEvents: 'none'}} /> {/* Hidden input for validation */}
                 {validated && rating === 0 && <div className="invalid-feedback d-block">Rating is required.</div>}
            </div>
        );
    };


    return (
        <form
            onSubmit={handleSubmit}
            className={`needs-validation ${validated ? 'was-validated' : ''}`}
            noValidate
        >
             <StarRating /> {/* Use the StarRating component */}

            <div className="mb-3">
                <label htmlFor="comment" className="form-label">Comment</label>
                <textarea
                    name="comment" // Changed from review[comment]
                    id="comment"
                    cols="30"
                    rows="3"
                    required
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="invalid-feedback">Comment is required.</div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}

export default ReviewForm;