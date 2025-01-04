import React from 'react';
import SampleUpload from './SampleUpload';

const ContentSection = () => {
    return (
        <section className="content-section">
            <h2>Upload Sample Artworks</h2>
            <p>Submit your artworks for verification and listing.</p>
            <SampleUpload />
        </section>
    );
};

export default ContentSection;
