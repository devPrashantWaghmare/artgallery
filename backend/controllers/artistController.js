const {User} = require('../models/UserDetails/baseUser');

// Get the authenticated user's profile
const getArtistProfile = async (req, res) => {
  try {
    // Get the user profile from the database based on the authenticated user
    const userProfile = await User.findById(req.user.id).select('-password'); // Exclude password field for security
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Return the user profile data
    res.status(200).json({
      profile: {
        id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        mobile: userProfile.mobile,
        role: userProfile.role,
        bio: userProfile.bio,
        artCategories: userProfile.artCategories, // The categories the artist is interested in
      },
      verificationStatus: userProfile.verificationStatus, 
      onboardingStatus: userProfile.onboardingStatus,  // Display the artist's onboarding status
      reviewDetails: userProfile.reviewDetails || { reviewStatus: 'N/A' }, // Artist review details
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Controller to get all products (Admin access)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email'); // Populate createdBy with user details
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Controller to create a product (Artist access)
const createProduct = async (req, res) => {
  try {
    const { title, description, category, medium, dimensions, type, price, thumbnail, availability, deliveryDetails } = req.body;

    // Ensure that the user is an artist
    if (!req.user || req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can create products' });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      medium,
      dimensions,
      type,
      price,
      thumbnail,
      availability,
      deliveryDetails,
      createdBy: req.user._id
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Controller to update a product (Artist access)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the product belongs to the logged-in artist
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Controller to delete a product (Artist access)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the product belongs to the logged-in artist
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Controller to get a product by ID (Anyone with token access)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Controller to get products created by a specific artist
const getArtistProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).populate('createdBy', 'name email');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist products', error: error.message });
  }
};

// Controller to get artists requiring review
const getArtistsForReview = async (req, res) => {
  try {
    const artists = await User.find({
      role: 'artist',
      $or: [
        { 'verificationStatus.aadhaarVerified': false },
        { 'verificationStatus.panVerified': false },
        { 'verificationStatus.bankAccountVerified': false },
        { 'verificationStatus.upiVerified': false },
        { 'verificationStatus.sampleArtworksSubmitted': true }
      ]
    }).populate('managedBy', 'name email').lean(); // Fetch admin reviewer details

    // Ensure all artists have `reviewDetails`
    artists.forEach((artist) => {
      artist.reviewDetails = artist.reviewDetails || { reviewStatus: 'N/A' };
    });

    const artworks = await Product.find({ isSample: true, reviewStatus: { $in: ['Pending', 'Approved', 'Rejected'] } })
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email');

    res.json({ artists, artworks });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data for review' });
  }
};

// Controller to update artwork review status
const updateArtworkReviewStatus = async (req, res) => {
  const { artworkId, reviewStatus, comments } = req.body;

  try {
    const updatedArtwork = await Product.findByIdAndUpdate(
      artworkId,
      {
        reviewStatus,
        reviewComments: comments,
        reviewedBy: req.user.id, // Assuming req.user contains authenticated user data
      },
      { new: true } // Return the updated document
    )
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email');

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    res.status(200).json({ message: 'Artwork review updated successfully', updatedArtwork });
  } catch (error) {
    console.error('Error updating artwork review status:', error);
    res.status(500).json({ error: 'Error updating artwork review status' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getArtistProducts,
  getArtistProfile,
  getArtistsForReview,
  updateArtworkReviewStatus,
};
