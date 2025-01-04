// src/components/Footer.js
import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/faq">FAQ</a>
                <a href="/support">Support</a>
                <a href="/about">About Us</a>
            </div>
            <div className="footer-social">
                <a href="https://facebook.com">Facebook</a>
                <a href="https://twitter.com">Twitter</a>
                <a href="https://instagram.com">Instagram</a>
            </div>
            <div className="footer-contact">
                <p>Contact: support@easyexams.com</p>
            </div>
        </footer>
    );
}

export default Footer;
