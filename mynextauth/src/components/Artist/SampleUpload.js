import React, { useState, useRef } from "react";
import axios from "../../services/api";
import styles from "../../styles/UploadContent.module.css";

const SampleUpload = ({ artistId }) => {
  const [sampleData, setSampleData] = useState({
    name: "",
    description: "",
    file: null,
    categoryId: "",
    typeId: "",
    isSample: true, // This marks the product as a sample
    price: "",
    availability: "available",
    fileKey: "",
    fileUrl: "",
    reviewDetails: {
      status: "Pending",
      comments: "",
    },
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!sampleData.file) {
        alert("Please upload a file.");
        return;
      }
      if (!sampleData.category || !sampleData.type || !sampleData.medium) {
        alert("Please fill in all required fields.");
        return;
      }
      if (sampleData.isForSale && (!sampleData.price || sampleData.price <= 0)) {
        alert("Please enter a valid price for selling artworks.");
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const fileKey = `samples/${artistId}_${Date.now()}_${sampleData.file.name}`;
      const formData = new FormData();
      formData.append("artistId", artistId);
      formData.append("fileKey", fileKey);
      formData.append("file", sampleData.file);
      formData.append("category", sampleData.category);
      formData.append("type", sampleData.type);
      formData.append("medium", sampleData.medium);
      formData.append("isForSale", sampleData.isForSale);
      formData.append("price", sampleData.price || 0);
      formData.append("availability", sampleData.availability);

      const response = await axios.post("/api/files/uploadSampleFile", formData, {
        ...config,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      alert("Sample uploaded successfully!");
      setSampleData({
        file: null,
        category: "",
        type: "",
        medium: "",
        isForSale: false,
        price: "",
        availability: "available",
        fileKey,
        fileUrl: response.data.fileUrl,
        status: "Pending",
        reviewComments: "",
      });
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setFilePreview(null);
    } catch (error) {
      console.error("Error uploading sample:", error);
      alert(
        error.response?.data?.message ||
          "Failed to upload sample. Please try again."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSampleData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSampleData((prev) => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.uploadContent}>
      <h2>Submit Sample Artwork</h2>
      <form className={styles.uploadForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Category:</label>
          <select
            name="category"
            value={sampleData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="abstract">Abstract</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Type:</label>
          <select
            name="type"
            value={sampleData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Medium:</label>
          <input
            type="text"
            name="medium"
            value={sampleData.medium}
            onChange={handleChange}
            placeholder="e.g., Oil on Canvas"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>For Sale:</label>
          <input
            type="checkbox"
            name="isForSale"
            checked={sampleData.isForSale}
            onChange={handleChange}
          />
        </div>

        {sampleData.isForSale && (
          <div className={styles.formGroup}>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={sampleData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Upload File:</label>
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            required
          />
        </div>

        {filePreview && (
          <div className={styles.filePreview}>
            <p>Preview:</p>
            <img src={filePreview} alt="File Preview" className={styles.previewImage} />
          </div>
        )}

        <button type="submit" className="submitButton">
          Submit Sample
        </button>

        {uploadProgress > 0 && (
          <div className="progressBar">
            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SampleUpload;
