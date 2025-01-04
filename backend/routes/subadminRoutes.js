const express = require('express');
const router = express.Router();
const { User } = require('../models/UserDetails/baseUser');
const {  Artist } = require('../models/UserDetails/artist');

const Product = require('../models/productDetails/ArtProduct');
const Role = require('../models/UserDetails/role');
const { protect, verifySubadmin, verifyToken } = require('../middleware/authMiddleware');

// Get all content creators and their products for the logged-in subadmin
router.get('/creators-and-products', protect, verifyToken, verifySubadmin, async (req, res) => {
    try {
        const subadminId = req.user._id;

        // Find all artists (creators) managed by the subadmin
        const creators = await Artist.find(
            { managedBy: subadminId },
            'name email role'
        ).populate('role', 'name permissions');

        if (!creators.length) {
            return res.status(404).json({ message: 'No creators managed by this subadmin.' });
        }

        // Fetch their products
        const creatorIds = creators.map((creator) => creator._id);
        const products = await Product.find({ createdBy: { $in: creatorIds } });

        // Prepare the response: creators with their products and roles
        const creatorDetails = creators.map((creator) => ({
            creator: {
                name: creator.name,
                email: creator.email,
                role: creator.role?.name || 'Unknown',
                permissions: creator.role?.permissions || {},
            },
            products: products.filter((product) => product.createdBy.equals(creator._id)),
        }));

        res.status(200).json(creatorDetails);
    } catch (error) {
        console.error('Error fetching creators and products:', error.message);
        res.status(500).json({ message: 'Failed to fetch creators and products.' });
    }
});

module.exports = router;
