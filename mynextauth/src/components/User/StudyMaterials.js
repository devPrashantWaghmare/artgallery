import React from 'react';
import '../../styles/StudyMaterials.css';

const StudyMaterials = ({ materials }) => (
    <div className="study-materials">
        <h3>Your Study Materials</h3>
        {materials.map(material => (
            <div key={material.id} className="material-card">
                <p>{material.name}</p>
                <a href={material.downloadLink} className="download-link">Download</a>
            </div>
        ))}
    </div>
);

export default StudyMaterials;
