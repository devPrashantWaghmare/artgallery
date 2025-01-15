// // routes/fileRoutes.js
// const express = require('express');
// const fileController = require('../controllers/fileController');
// const { protect,verifyRole,verifyToken } = require('../middleware/authMiddleware');


// const router = express.Router();
// // Route for uploading a file
// router.post('/uploadSampleFile', protect,verifyToken, fileController.uploadSampleFile);
// router.post('/uploadArtwork', protect,verifyToken, fileController.uploadArtwork);


// // Route for deleting a file
// router.post('/delete', protect, verifyToken, fileController.deleteFile);
// router.get('/creator-products', protect, verifyToken, fileController.getProductsByCreator);

// module.exports = router;

// routes/fileRoutes.js
const express = require("express");
const fileController = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// File operations
router.post("/uploadSampleFile", protect, fileController.uploadSampleFile);
router.post("/uploadArtwork", protect, fileController.uploadArtwork);
router.post("/delete", protect, fileController.deleteFile);
router.get("/creator-products", protect, fileController.getProductsByCreator);

module.exports = router;
