import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

const categories = ['room', 'iconic city', 'mountain', 'beach', 'castle', 'pool', 'farm', 'arctic'];

function EditListingPage() {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        country: '',
        location: '',
        category: '',
    });
    const [originalImageUrl, setOriginalImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [submitting, setSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/listings/${listingId}`);
                const listing = response.data;
                setFormData({
                    title: listing.title || '',
                    description: listing.description || '',
                    price: listing.price || '',
                    country: listing.country || '',
                    location: listing.location || '',
                    category: listing.category || '',
                });
                setOriginalImageUrl(listing.image?.url || '');
            } catch (error) {
                console.error('Fetch listing error:', error);
                toast.error(error.response?.data?.message || 'Failed to load listing data.');
                navigate('/listings'); // Redirect if listing not found or error
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [listingId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setSubmitting(true);
        setValidated(true);

        const submissionData = new FormData();
        submissionData.append('listing[title]', formData.title);
        submissionData.append('listing[description]', formData.description);
        submissionData.append('listing[price]', formData.price);
        submissionData.append('listing[country]', formData.country);
        submissionData.append('listing[location]', formData.location);
        submissionData.append('listing[category]', formData.category);
        if (imageFile) {
            submissionData.append('listing[image]', imageFile);
        }
        // If image not changed, don't send image field or send null indicator if backend expects it


        try {
            const response = await apiClient.put(`/listings/${listingId}`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Listing updated successfully!');
                navigate(`/listings/${listingId}`);
            }
        } catch (error) {
            console.error('Update listing error:', error);
            toast.error(error.response?.data?.message || 'Failed to update listing.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
    }

    return (
        <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">Edit Your Listing</h2>
                <form
                    onSubmit={handleSubmit}
                    className={`needs-validation ${validated ? 'was-validated' : ''}`}
                    noValidate
                    encType="multipart/form-data"
                >
                     <div className="mb-3">
                         <label htmlFor="title" className="form-label">Title</label>
                         <input
                             type="text"
                             className="form-control"
                             id="title"
                             name="title"
                             value={formData.title}
                             onChange={handleChange}
                             required
                         />
                         <div className="invalid-feedback">Title is required.</div>
                     </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <div className="invalid-feedback">Description is required.</div>
                    </div>

                    {originalImageUrl && (
                         <div className="mb-3">
                             <p>Current Image:</p>
                             <img src={originalImageUrl} alt="Current listing" style={{ width: '150px', height: 'auto', borderRadius: '8px' }}/>
                         </div>
                    )}


                     <div className="mb-3">
                         <label htmlFor="image" className="form-label">Upload New Image (Optional)</label>
                         <input
                             type="file"
                             className="form-control"
                             id="image"
                             name="image"
                             onChange={handleFileChange}
                             accept="image/*"
                         />
                     </div>


                     <div className="mb-3">
                         <label htmlFor="price" className="form-label">Price</label>
                         <input
                             type="number"
                             className="form-control"
                             id="price"
                             name="price"
                             value={formData.price}
                             onChange={handleChange}
                             min="0"
                             required
                         />
                         <div className="invalid-feedback">Price must be non-negative.</div>
                     </div>

                     <div className="mb-3">
                         <label htmlFor="country" className="form-label">Country</label>
                         <input
                             type="text"
                             className="form-control"
                             id="country"
                             name="country"
                             value={formData.country}
                             onChange={handleChange}
                             required
                         />
                         <div className="invalid-feedback">Country is required.</div>
                     </div>

                     <div className="mb-3">
                         <label htmlFor="location" className="form-label">Location</label>
                         <input
                             type="text"
                             className="form-control"
                             id="location"
                             name="location"
                             value={formData.location}
                             onChange={handleChange}
                             required
                         />
                         <div className="invalid-feedback">Location is required.</div>
                     </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            className="form-select"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditListingPage;