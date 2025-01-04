import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const Overview = () => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get('/api/subadmin/overview');
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          <p>Total Users: {metrics.totalUsers}</p>
          <p>Total Courses: {metrics.totalCourses}</p>
          <p>Active Content Creators: {metrics.activeCreators}</p>
          <p>Pending Payments: {metrics.pendingPayments}</p>
        </div>
      )}
    </div>
  );
};

export default Overview;
