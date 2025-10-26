import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);
        setValidated(true);

        try {
            await login(formData.username, formData.password);
            const from = location.state?.from?.pathname || '/listings';
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed on page:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="login-card card p-4 shadow" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 className="mb-4 text-center">Log In</h2>
                <form
                    id="login-form"
                    onSubmit={handleSubmit}
                    className={`needs-validation ${validated ? 'was-validated' : ''}`}
                    noValidate
                >
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control frm"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Username is required.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control frm"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="invalid-feedback">Password is required.</div>
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>

                    <div className="signup-text text-center mt-3">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;