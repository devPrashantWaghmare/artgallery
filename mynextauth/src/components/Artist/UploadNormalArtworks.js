import React, { useState, useRef, useEffect } from "react";
import axios from "../../services/api";
import styles from "../../styles/UploadContent.module.css";

const UploadNormalArtworks = ({
  baseDirectory = "",
  username,
  isOnboarded = false,
}) => {
  console.log("in UpoloadNormalArtworks - baseDirecotry,username: ",baseDirectory,username);
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    category: "",
    medium: "",
    dimensions: "",
    type: "",
    price: "",
    isFramed: "no",
    material: "",
    productionStatus: "ready_to_ship",
    copiesAvailable: 1,
    isCustomizable: "no",
    isDigitalPrint: "no",
    displayForSale: "yes",
    file: null,
    isSample: false,
    username,
    });

  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/products/attributes");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        alert("Failed to load categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContentData({ ...contentData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert("File size exceeds the limit of 10MB.");
      return;
    }
    setContentData({ ...contentData, file });
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

        const fileKey = `${baseDirectory}/artworks/${username}/${Date.now()}_${
        contentData.file.name
      }`;

      const formData = new FormData();
      Object.keys(contentData).forEach((key) => {
        formData.append(key, contentData[key]);
      });
      formData.append("fileKey", fileKey);

      const response = await axios.post("/api/files/uploadArtwork", formData, {
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

      alert("Artwork uploaded successfully!");
      setContentData({
        title: "",
        description: "",
        category: "",
        medium: "",
        dimensions: "",
        type: "",
        price: "",
        isFramed: "no",
        material: "",
        productionStatus: "ready_to_ship",
        deliveryTime: "",
        copiesAvailable: 1,
        isCustomizable: "no",
        isDigitalPrint: "no",
        isHandmade: "yes",
        displayForSale: "yes",
        file: null,
        isSample: false,
        });
      setUploadProgress(0);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error uploading artwork:", error);
      alert("Failed to upload artwork. Please try again.");
    }
  };

  return (
    <div className={styles.uploadContent}>
      <h2>Upload Normal Artwork</h2>
      {!isOnboarded && (
        <p style={{ color: "red" }}>
          Note: You are not verified yet. This feature is available for
          onboarded artists only.
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={contentData.title}
            onChange={handleChange}
            placeholder="Enter artwork title"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={contentData.description}
            onChange={handleChange}
            placeholder="Enter a brief description"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isFramed">Frame Availability</label>
          <select
            id="isFramed"
            name="isFramed"
            value={contentData.isFramed}
            onChange={handleChange}
          >
            <option value="yes">Framed</option>
            <option value="no">Not Framed</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="material">Material</label>
          <input
            type="text"
            id="material"
            name="material"
            value={contentData.material}
            onChange={handleChange}
            placeholder="E.g., Canvas, Paper"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={contentData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="medium">Medium</label>
          <input
            type="text"
            id="medium"
            name="medium"
            value={contentData.medium}
            onChange={handleChange}
            placeholder="E.g., Oil, Acrylic"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dimensions">Dimensions</label>
          <input
            type="text"
            id="dimensions"
            name="dimensions"
            value={contentData.dimensions}
            onChange={handleChange}
            placeholder="E.g., 24x36 inches"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={contentData.type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
          <option value="digital">Digital</option>
          <option value="physical">Physical</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={contentData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="deliveryTime">Delivery Time</label>
          <input
            type="text"
            id="deliveryTime"
            name="deliveryTime"
            value={contentData.deliveryTime}
            onChange={handleChange}
            placeholder="E.g., 7-10 days"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="copiesAvailable">Copies Available</label>
          <input
            type="number"
            id="copiesAvailable"
            name="copiesAvailable"
            value={contentData.copiesAvailable}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isCustomizable">Customizable</label>
          <select
            id="isCustomizable"
            name="isCustomizable"
            value={contentData.isCustomizable}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isDigitalPrint">Digital Print</label>
          <select
            id="isDigitalPrint"
            name="isDigitalPrint"
            value={contentData.isDigitalPrint}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isHandmade">Handmade</label>
          <select
            id="isHandmade"
            name="isHandmade"
            value={contentData.isHandmade}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="displayForSale">Display for Sale</label>
          <select
            id="displayForSale"
            name="displayForSale"
            value={contentData.displayForSale}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="file">Upload File</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
          {filePreview && (
            <img
              src={filePreview}
              alt="Preview"
              className={styles.filePreview}
            />
          )}
        </div>
        {uploadProgress > 0 && (
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width: `${uploadProgress}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          Upload Artwork
        </button>
      </form>
    </div>
  );
};

export default UploadNormalArtworks;
