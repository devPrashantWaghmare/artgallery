// backend/services/userService.js
const { User } = require('../models/UserDetails/User');
const Role = require('../models/UserDetails/Role_Permissions');
const bcrypt = require('bcryptjs');

const getUserById = async (userId) => {
    return await User.findById(userId).populate('role','name permissions');
};

const createUser = async ({ name, email, mobile, password, roleName }) => {
    const role = await Role.findOne({ name: roleName });
    if (!role) throw new Error('Invalid role specified');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPassword, role: role._id });
    await newUser.save();
    return newUser;
};

const updateUser = async (userId, updates) => {
    return await User.findByIdAndUpdate(userId, updates, { new: true });
};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

const getUsersWithDetails = async () => {
    return await User.find().populate('role');
};

module.exports = { getUserById, createUser, updateUser, deleteUser, getUsersWithDetails };
