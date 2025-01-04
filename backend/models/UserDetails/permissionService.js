//backend/models/UserDetails/permissionService.js
const Role = require('./role');
const User = require('./baseUser');

/**
 * Helper function to calculate effective permissions for a role.
 * Handles inherited roles recursively.
 * @param {Object} role - Role object with permissions.
 * @returns {Object} Effective permissions.
 */
const calculateEffectivePermissions = async (role) => {
    let permissions = { ...role.permissions };
    if (role.inherits) {
        const parentRole = await Role.findById(role.inherits).populate('inherits');
        if (parentRole) {
            const parentPermissions = await calculateEffectivePermissions(parentRole);
            permissions = { ...parentPermissions, ...permissions };
        }
    }
    return permissions;
};

/**
 * Evaluate if a user has permission for a specific action.
 * @param {String} userId - User ID.
 * @param {String} action - Action to check permission for.
 * @returns {Boolean} Whether the user has the permission.
 */
const evaluatePermissions = async (userId, action) => {
    const user = await User.findById(userId).populate('role');
    if (!user) throw new Error('User not found');

    const rolePermissions = await calculateEffectivePermissions(user.role);
    const effectivePermissions = { ...rolePermissions, ...user.customPermissions };

    return effectivePermissions[action] || false;
};

/**
 * Check if a user has permission for a specific action (alias for evaluatePermissions).
 * @param {String} userId - User ID.
 * @param {String} action - Action to check permission for.
 * @returns {Boolean} Whether the user has the permission.
 */
const checkPermission = evaluatePermissions;

/**
 * List all permissions for a specific role.
 * @param {String} roleId - Role ID.
 * @returns {Object} Permissions of the role.
 */
const listPermissions = async (roleId) => {
    const role = await Role.findById(roleId).populate('inherits');
    if (!role) throw new Error('Role not found');

    return calculateEffectivePermissions(role);
};

/**
 * Check if a user has a specific permission (flexible and includes user custom permissions).
 * @param {String} userId - User ID.
 * @param {String} action - Action to check permission for.
 * @returns {Boolean} Whether the user has the permission.
 */
const hasPermission = evaluatePermissions;

module.exports = {
    calculateEffectivePermissions,
    evaluatePermissions,
    checkPermission,
    listPermissions,
    hasPermission,
};
