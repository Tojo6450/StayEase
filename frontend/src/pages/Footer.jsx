import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light border-top">
      <div className="container text-center">
        <div className="mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2 fs-5">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2 fs-5">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2 fs-5">
              <i className="fab fa-linkedin-in"></i>
            </a>
        </div>
        <div className="company-name mb-1 fw-bold">
          StayEase &copy; {new Date().getFullYear()}
        </div>
        <div className="footer-links small">
          <Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link> |{' '}
          <Link to="/terms" className="text-muted text-decoration-none">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;