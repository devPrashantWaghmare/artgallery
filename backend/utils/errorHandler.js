// backend/utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}`);
    console.error(err.stack || "No stack available");
  
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
    });
  };
  module.exports = errorHandler;
