// components/CookieConsent.js
import React, { useState } from 'react';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(!localStorage.getItem('cookieConsent'));

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowBanner(false);
    };

    return (
        showBanner && (
            <div className="cookie-banner">
                <p>
                    We use cookies to improve your experience and ensure the proper functioning of the app.
                </p>
                <button onClick={handleAccept}>Accept</button>
            </div>
        )
    );
};

export default CookieConsent;
