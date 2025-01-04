// frontend/src/pages/SubadminPages/ContentManagement.js

import React, { useState, useEffect } from "react";
import axios from "../../services/api";

const ContentManagement = () => {
  const [pendingContent, setPendingContent] = useState([]);
  const [approvedContent, setApprovedContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/subadmin/content", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPendingContent(response.data.pending);
      setApprovedContent(response.data.approved);
    } catch (error) {
      setMessage("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (contentId, action) => {
    try {
      const response = await axios.post(
        `/api/subadmin/content/${contentId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(response.data.message);
      fetchContent();
    } catch (error) {
      setMessage("Failed to update content status.");
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div>
      <h2>Content Management</h2>
      {message && <p>{message}</p>}
      <h3>Pending Content</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        pendingContent.map((content) => (
          <div key={content._id}>
            <h4>{content.title}</h4>
            <p>{content.description}</p>
            <button onClick={() => handleApproval(content._id, "approve")}>
              Approve
            </button>
            <button onClick={() => handleApproval(content._id, "reject")}>
              Reject
            </button>
          </div>
        ))
      )}

      <h3>Approved Content</h3>
      {approvedContent.map((content) => (
        <div key={content._id}>
          <h4>{content.title}</h4>
        </div>
      ))}
    </div>
  );
};

export default ContentManagement;
