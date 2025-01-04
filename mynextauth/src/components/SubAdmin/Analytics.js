import React, { useState, useEffect } from "react";
import axios from "../../services/api";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("/api/subadmin/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Total Users: {analytics.totalUsers}</p>
          <p>Active Content Creators: {analytics.activeContentCreators}</p>
          <p>Courses Published: {analytics.totalCourses}</p>
          <p>Pending Feedback: {analytics.pendingFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
