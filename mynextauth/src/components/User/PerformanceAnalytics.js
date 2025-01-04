import React from 'react';
import '../../styles/PerformanceAnalytics.css';

const PerformanceAnalytics = ({ courses }) => (
    <div className="performance-analytics">
        <h3>Your Performance</h3>
        <p>Overall Progress: 75%</p>
        <p>Strengths: Mathematics, Reasoning</p>
        <p>Improvement Areas: English, General Awareness</p>
    </div>
);

export default PerformanceAnalytics;
