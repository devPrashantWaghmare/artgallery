import React from 'react';
import '../../styles/EnrolledCourses.css';

const EnrolledCourses = ({ courses }) => (
    <div className="enrolled-courses">
        <h3>Your Enrolled Courses</h3>
        {courses.map(course => (
            <div key={course.id} className="course-card">
                <h4>{course.name}</h4>
                <p>Progress: {course.progress}%</p>
                <button className="resume-button">Resume Course</button>
            </div>
        ))}
    </div>
);

export default EnrolledCourses;
