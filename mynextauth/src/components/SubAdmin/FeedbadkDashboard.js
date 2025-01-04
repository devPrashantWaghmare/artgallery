import React, { useState, useEffect } from "react";
import axios from "../../services/api";

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [response, setResponse] = useState({ feedbackId: "", text: "" });
  const [message, setMessage] = useState("");

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("/api/subadmin/feedback", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFeedbacks(response.data);
    } catch (error) {
      setMessage("Failed to fetch feedback.");
    }
  };

  const handleResponse = async (feedbackId) => {
    try {
      const response = await axios.post(
        `/api/subadmin/feedback/${feedbackId}/response`,
        { text: response.text },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(response.data.message);
      setResponse({ feedbackId: "", text: "" });
      fetchFeedbacks();
    } catch (error) {
      setMessage("Failed to send response.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div>
      <h2>Feedback Dashboard</h2>
      {message && <p>{message}</p>}
      {feedbacks.map((feedback) => (
        <div key={feedback._id}>
          <p><strong>User:</strong> {feedback.user}</p>
          <p><strong>Feedback:</strong> {feedback.text}</p>
          {feedback.response ? (
            <p><strong>Response:</strong> {feedback.response}</p>
          ) : (
            <div>
              <textarea
                value={response.feedbackId === feedback._id ? response.text : ""}
                onChange={(e) =>
                  setResponse({ feedbackId: feedback._id, text: e.target.value })
                }
                placeholder="Write a response..."
              />
              <button onClick={() => handleResponse(feedback._id)}>Respond</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackDashboard;
