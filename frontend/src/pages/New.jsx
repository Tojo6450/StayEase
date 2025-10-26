import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

const categories = ['room', 'iconic city', 'mountain', 'beach', 'castle', 'pool', 'farm', 'arctic'];

function NewListingPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        country: '',
        location: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

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

        if (form.checkValidity() === false || !imageFile) {
            event.stopPropagation();
             if (!imageFile) toast.error("Please select an image file.");
            setValidated(true);
            return;
        }

        setLoading(true);
        setValidated(true);

        const submissionData = new FormData();
        submissionData.append('listing[title]', formData.title);
        submissionData.append('listing[description]', formData.description);
        submissionData.append('listing[price]', formData.price);
        submissionData.append('listing[country]', formData.country);
        submissionData.append('listing[location]', formData.location);
        submissionData.append('listing[category]', formData.category);
        submissionData.append('listing[image]', imageFile); // Key matches backend Multer field

        try {
            const response = await apiClient.post('/listings', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Listing created successfully!');
                navigate(`/listings/${response.data.listing._id}`);
            }
        } catch (error) {
            console.error('Create listing error:', error);
            toast.error(error.response?.data?.message || 'Failed to create listing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">Create a New Listing</h2>
                <form
                    id="listing-form"
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
                            placeholder="Enter title"
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
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <div className="invalid-feedback">Description is required.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Upload Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            required={!imageFile} // Required only if no file selected
                            accept="image/*" // Suggest image files
                        />
                        <div className="invalid-feedback">Image is required.</div>
                    </div>

                     <div className="mb-3">
                         <label htmlFor="price" className="form-label">Price</label>
                         <input
                             type="number"
                             className="form-control"
                             id="price"
                             name="price"
                             placeholder="Enter price"
                             value={formData.price}
                             onChange={handleChange}
                             min="0"
                             required
                         />
                         <div className="invalid-feedback">Price is required and must be non-negative.</div>
                     </div>


                     <div className="mb-3">
                         <label htmlFor="country" className="form-label">Country</label>
                         <input
                             type="text"
                             className="form-control"
                             id="country"
                             name="country"
                             placeholder="Enter country"
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
                            placeholder="Enter location"
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
                            <option value="" disabled>Select category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Adding Listing...' : 'Add Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewListingPage;