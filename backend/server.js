const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const twilio = require('twilio');
//const { connectRedis } = require('./utils/redisClient');


// Configurations
dotenv.config({ path: path.resolve(__dirname, '.env') });
const { connectDB } = require('./config/setup-db-superadmin');
const errorHandler = require('./utils/errorHandler');

// Routes
const socialAuthRoutes = require('./routes/socialAuthRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const otpRoutes = require('./routes/otpRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subadminRoutes = require('./routes/subadminRoutes');
const couponRoutes = require('./routes/couponRoutes');
const productRoutes = require('./routes/productRoutes');
const fileRoutes = require('./routes/fileRoutes');
const roleController = require('./controllers/roleController');
// const kycRoutes = require('./routes/kycRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Routes

///api/social-Auth/social-login
app.use('/api/social-Auth', socialAuthRoutes);
app.use('/api/token',tokenRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roles', roleController);

app.use('/api/coupons', couponRoutes);
app.use('/api/products', productRoutes);    
app.use('/api/files', fileRoutes);
app.use('/api/subadmin', subadminRoutes);
app.use('/api/artist', artistRoutes);
//app.use('/api/uidai', kycRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else {
        res.status(500).json({ message: 'Server Error' });
    }
});
app.use(errorHandler);
//connectRedis(); // Connect Redis at startup. we are connecting in socialLogin in authcontroller


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
