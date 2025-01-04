// controllers/fileController.js
const multer = require("multer");
const s3Service = require("../services/s3Service");
const Product = require("../models/productDetails/ArtProduct"); // Mongoose model
const User = require("../models/UserDetails/baseUser");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file"); // The field name from form-data should be 'file'

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "text/plain",
];

// Upload file route
async function uploadSampleFile(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file", error: err.message });
    }
    try {
      const {
        title,
        description,
        type,
        category,
        medium,
        dimensions,
        price,
        availability,
        deliveryDetails,
        username,
        displayForSale,
        copiesAvailable,
      } = req.body;

      // Validate required fields
      if (!title || !type || !category || !displayForSale || !copiesAvailable) {
        return res.status(400).json({ message: "Missing required fields: title, type, category, displayForSale, copiesAvailable" });
      }

      // Check if file is required for non-physical products
      if (!req.file && type !== "physical") {
        return res.status(400).json({ message: "File is required for non-physical products" });
      }

      const contentType = req.file ? req.file.mimetype : null;
      const fileBuffer = req.file ? req.file.buffer : null;

      // Validate file type
      if (contentType && !ALLOWED_FILE_TYPES.includes(contentType)) {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      const fileKey = req.file
        ? `artists/sampleArtworks/${username}/${type}_${Date.now()}_${req.file.originalname}`
        : null;

      let fileUrl = '';
      if (fileBuffer && fileKey) {
        const result = await s3Service.uploadFile(
          process.env.AWS_S3_BUCKET_NAME,
          fileKey,
          fileBuffer,
          contentType
        );
        fileUrl = result.Location; // S3 file URL
      }

      const newProduct = new Product({
        title,
        description,
        type,
        category,
        medium,
        dimensions,
        price: price || 0,
        availability: availability || "available",
        deliveryDetails,
        displayForSale,
        copiesAvailable,
        fileKey,
        fileUrl,
        createdBy: req.user.id, // Assuming user authentication
        reviewStatus: "Pending",
        isSample: true,
      });

      await newProduct.save();
      await User.findByIdAndUpdate(req.user.id, { "verificationStatus.sampleArtworksSubmitted": true });

      res.status(200).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to upload product", error: err.message });
    }
  });
}

async function uploadArtwork(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading file", error: err.message });
    }
    try {
      const {
        title,
        description,
        type,
        category,
        medium,
        dimensions,
        price,
        availability,
        deliveryDetails,
        username,
        isFramed,
        material,
        productionStatus,
        copiesAvailable,
        isCustomizable,
        isDigitalPrint,
        displayForSale,
        
      } = req.body;

      // Validate required fields
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "File is required" });
      }
      if (!type || !category || !title) {
        return res
          .status(400)
          .json({ message: "Type, category, and title are required" });
      }

      const contentType = req.file ? req.file.mimetype : null;
      const fileBuffer = req.file ? req.file.buffer : null;

      if (contentType && !ALLOWED_FILE_TYPES.includes(contentType)) {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      const fileKey = req.file
      ? `artists/artworks/${username}/${type}_${Date.now()}_${req.file.originalname}`
      : null;

      let fileUrl = '';
      if (fileBuffer && fileKey) {
        const result = await s3Service.uploadFile(
          process.env.AWS_S3_BUCKET_NAME,
          fileKey,
          fileBuffer,
          contentType
        );
        fileUrl = result.Location; // S3 file URL
      }

      // Save metadata in the database
      const newProduct = new Product({
        title,
        description,
        type,
        category,
        medium,
        dimensions,
        price: price || 0,
        availability: availability || "available",
        deliveryDetails,
        isFramed,
        material,
        productionStatus,
        copiesAvailable,
        isCustomizable,
        displayForSale,
        fileKey,
        fileUrl,
        createdBy: req.user.id, // Assuming user authentication
        reviewStatus: "Pending",
        isSample: true,
      });

      await newProduct.save();
      res.status(200).json({
        message: "Product uploaded successfully",
        product: newProduct,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to upload product", error: err.message });
    }
  });
}

// Delete file route
async function deleteFile(req, res) {
  try {
    const { fileKey } = req.body; // File key passed in the body
    if (!fileKey) {
      return res.status(400).json({ message: "Missing fileKey" });
    }

    const result = await s3Service.deleteFile(
      process.env.AWS_S3_BUCKET_NAME,
      fileKey
    );
    await Product.deleteOne({ fileKey });

    res.status(200).json({ message: "File deleted successfully", result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete file", error: err.message });
  }
}

// Fetch products by creator route
async function getProductsByCreator(req, res) {
  try {
    const creatorId = req.user.id; // Assumes authenticated user
    const products = await Product.find({ createdBy: creatorId });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
}

module.exports = {
  uploadSampleFile,
  uploadArtwork,
  deleteFile,
  getProductsByCreator,
};
