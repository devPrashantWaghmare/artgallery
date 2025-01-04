// services/s3Service.js
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/aws');

// Upload or overwrite a file
async function uploadFile(bucket, key, fileContent, contentType) {
  const uploadParams = {
    Bucket: bucket,
    Key: key,           // Path to the file in your S3 bucket
    Body: fileContent,  // File content (Buffer, Stream, or String)
    ContentType: contentType,  // MIME type of the file
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('File uploaded successfully', data);
    return data;
  } catch (err) {
    console.error('Error uploading file', err);
    throw err;  // Re-throw the error so it can be handled by the controller
  }
}

// Delete a file from S3
async function deleteFile(bucket, key) {
  const deleteParams = {
    Bucket: bucket,
    Key: key,  // Path to the file in your S3 bucket
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log('File deleted successfully', data);
    return data;
  } catch (err) {
    console.error('Error deleting file', err);
    throw err;  // Re-throw the error so it can be handled by the controller
  }
}

module.exports = {
  uploadFile,
  deleteFile,
};
