import React from 'react';

const ProfileSection = ({ profileData, verificationStatus }) => {
    return (
        <section className="profile-section">
            <h2>Profile Information</h2>
            <div>
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone:</strong> {profileData.phone}</p>
            </div>

            <h3>KYC Verification Status</h3>
            <ul>
                <li>Aadhaar Verified: {verificationStatus?.aadhaarVerified ? 'Yes' : 'No'}</li>
                <li>PAN Verified: {verificationStatus?.panVerified ? 'Yes' : 'No'}</li>
                <li>Bank Account Verified: {verificationStatus?.bankAccountVerified ? 'Yes' : 'No'}</li>
                <li>UPI Verified: {verificationStatus?.upiVerified ? 'Yes' : 'No'}</li>
                <li>Sample Artworks Submitted: {verificationStatus?.sampleArtworksSubmitted ? 'Yes' : 'No'}</li>
            </ul>
        </section>
    );
};

export default ProfileSection;
