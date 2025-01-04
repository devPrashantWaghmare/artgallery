const { S3Client } = require('@aws-sdk/client-s3');

// Create an S3 client with your credentials and region
const s3Client = new S3Client({
  region: 'us-east-1',  // Your S3 bucket's region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Store these in your .env file for security
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3Client;
