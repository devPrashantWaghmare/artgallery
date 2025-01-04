const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['video', 'eBook', 'testSeries', 'pdf', 'image', 'other'], 
        required: true 
    }, // This distinguishes content types
    thumbnail: String, // Optional thumbnail for visual content
    duration: String, // Duration for video content only
    filePath: String, // File storage path (e.g., S3 or local path)
    fileType: { 
        type: String, 
        enum: ['mp4', 'pdf', 'jpg', 'png', 'txt', 'docx'], 
        default: null 
    }, // Specifies actual file format
    fileUrl: { type: String, required: [true, "File URL is required"] }, // S3 URL or file path

    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    downloadCount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
