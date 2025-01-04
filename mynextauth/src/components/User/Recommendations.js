import React from 'react';
import '../../styles/Recommendations.css';

const Recommendations = ({ courses }) => (
    <div className="recommendations">
        <h3>Recommended for You</h3>
        {courses.map(course => (
            <div key={course.id} className="recommended-course-card">
                <p>{course.name}</p>
                <button className="enroll-button">Enroll Now</button>
            </div>
        ))}
    </div>
);

export default Recommendations;
