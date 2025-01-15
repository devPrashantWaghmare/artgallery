const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User} = require('../models/UserDetails/baseUser');
const Role = require('../models/UserDetails/role')
const Product = require('../models/productDetails/ArtProduct');
const { protect, verifyToken ,verifyRole} = require('../middleware/authMiddleware');

// Get all users with optional role filtering
router.get('/filter', protect, async (req, res) => {
    const { role } = req.query;

    try {
        let query = {};

        if (role) {
            // Find the Role ObjectId by its name
            const roleObj = await Role.findOne({ name: role });
            if (!roleObj) {
                return res.status(400).json({ message: 'Invalid role specified' });
            }
            query.role =  roleObj._id;
        }

       
        const users = await User.find(query, 'name email role').populate('role','name permissions ');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Get all users (without any filters)
router.get('/', protect,  async (req, res) => {
    try {
        const users = await User.find({}, 'name email role permissions').populate('role', 'name permissions');;
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
// GET /api/admin/roles/getRoles
router.get("/getRoles", protect, async (req, res) => {
    try {
      // Fetch all roles including inherited role details (if applicable)
      const roles = await Role.find({}).populate("inherits", "name permissions"); // Populating 'inherits' with 'name' and 'permissions'
      res.status(200).json({ success: true, data: roles });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ success: false, message: "Failed to fetch roles" });
    }
  });
  

// Assign a subadmin to manage artist
router.post('/assign-subadmin', protect, async (req, res) => {
    const { subadminId, contentCreatorIds } = req.body;

    try {
        // Validate if the subadmin exists and has the correct role
        const subadmin = await User.findById(subadminId).populate('role', 'name permissions');;
        if (!subadmin || subadmin.role.name !== 'subadmin') {
            return res.status(404).json({ message: 'Subadmin not found or invalid' });
        }

        // Validate if all provided IDs belong to artist
        const contentCreators = await User.find({
            _id: { $in: contentCreatorIds },
            role: 'artist',
        }).populate('role', 'name permissions');;

        if (contentCreators.length !== contentCreatorIds.length) {
            return res.status(400).json({
                message: 'Some IDs are not valid artist.',
            });
        }

        // Update managedBy field for the valid artist
        const updatedCreators = await User.updateMany(
            { _id: { $in: contentCreatorIds }, role: 'artist' },
            { $set: { managedBy: subadminId } }
        );

        res.status(200).json({
            message: `Successfully assigned ${updatedCreators.nModified} artist to subadmin.`,
        });
    } catch (error) {
        console.error('Error assigning subadmin:', error);
        res.status(500).json({ message: 'Failed to assign artist.' });
    }
});


// Get all artist managed by a specific subadmin
router.get('/subadmin-creators/:subadminId', protect, async (req, res) => {
    const { subadminId } = req.params;

    try {
        const creators = await User.find(
            { managedBy: subadminId, role: 'artist' },
            'name email'
        );
        
        const creatorIds = creators.map((creator) => creator._id);
        const products = await Product.find({ createdBy: { $in: creatorIds } });
        
        const creatorDetails = creators.map((creator) => ({
            creator,
            products: products.filter((product) => product.createdBy.equals(creator._id)),
        }));
        

        res.status(200).json(creatorDetails);
    } catch (error) {
        console.error('Error fetching subadmin creators:', error);
        res.status(500).json({ message: 'Failed to fetch artist.' });
    }
});
// Update User to Subadmin
router.put('/api/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role, permissions } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role || 'Subadmin';
        user.permissions = permissions || [];
        await user.save();

        res.status(200).json({ message: 'Role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// KYC Verification
router.put('/api/users/:id/kyc', async (req, res) => {
    const { id } = req.params;
    const { kycStatus } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.kycStatus = kycStatus;
        await user.save();

        res.status(200).json({ message: 'KYC status updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Create a New Permission
router.post('/api/permissions', async (req, res) => {
    const { name, description, actions } = req.body;

    try {
        const newPermission = new Permission({ name, description, actions });
        await newPermission.save();

        res.status(201).json({ message: 'Permission created successfully', permission: newPermission });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update Existing Permission
router.put('/api/permissions/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, actions } = req.body;

    try {
        const permission = await Permission.findById(id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });

        permission.name = name || permission.name;
        permission.description = description || permission.description;
        permission.actions = actions || permission.actions;

        await permission.save();
        res.status(200).json({ message: 'Permission updated successfully', permission });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Update or Revoke Permissions
router.put('/api/users/:id/permissions', async (req, res) => {
    const { id } = req.params;
    const { permissions } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.permissions = permissions;
        await user.save();

        res.status(200).json({ message: 'Permissions updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
async function updateUserRole(email, newRole) {
    const user = await User.findOneAndUpdate(
      { email },
      { role: newRole, $inc: { userVersion: 1 } },
      { new: true }
    );
    await redisClient.del(`user:role:${email}`); // Invalidate Redis cache
    return user;
  }
  

module.exports = router;
