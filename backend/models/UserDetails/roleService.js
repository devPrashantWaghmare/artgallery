// backend/models/UserDetails/roleService.js
const Role = require('./role');

/**
 * Creates default roles if they do not already exist in the database.
const roleRoutes = {
    SuperAdmin: '/superadmin/dashboard',
    Admin: '/admin/dashboard',
    SubAdmin: '/subadmin/dashboard',
    Artist: '/artist/dashboard',
    User: '/user/dashboard',
  }; 
*/
const createRoles = async () => {
  const roles = [
    {
      name: 'SuperAdmin',
      permissions: {
        canOnboardArtists: true,
        canOfferDiscounts: true,
        canManageProducts: true,
        canVerifyUsers: true,
        canManageOrders: true,
        canManageTransactions: true,
        canManagePayments: true,
        manageUsers: true,
        manageRoles: true,
        monitorActivities: true,
        accessReports: true,
        systemMaintenance: true,
      },
      route: '/superadmin/dashboard',

    },
    {
      name: 'Admin',
      permissions: {
        canOnboardArtists: true,
        canManageProducts: true,
        canVerifyUsers: true,
        canManageOrders: true,
        canManageTransactions: true,
        manageUsers: true,
        manageRoles: true,
        accessReports: true,
      },
      route: '/admin/dashboard',
    },
    {
      name: 'SubAdmin',
      permissions: {
        canOnboardArtists: true,
        canOfferDiscounts: true,
        canManageProducts: true,
        canManageOrders: true,
      },
      route:'/subadmin/dashboard',
    },
    {
      name: 'Artist',
      permissions: {}, // Artists don't need granular permissions
      route:'/artist/dashboard',
    },
    {
      name: 'User',
      permissions: {}, // General users don't require admin permissions
      route:'/user/dashboard'
    },
  ];

  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      await Role.create(role);
    }
  }
};

/**
 * Adds a new role to the system.
 * @param {String} name - Name of the role
 * @param {Object} permissions - Permissions object
 * @returns {Object} - The created role
 */
const addRole = async (name, permissions) => {
  const existingRole = await Role.findOne({ name });
  if (existingRole) throw new Error('Role already exists');

  const newRole = new Role({ name, permissions });
  return await newRole.save();
};

/**
 * Updates an existing role's details.
 * @param {String} roleId - ID of the role to update
 * @param {Object} updates - Updates to apply (e.g., permissions, name)
 * @returns {Object} - The updated role
 */
const updateRole = async (roleId, updates) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  Object.assign(role, updates);
  return await role.save();
};

/**
 * Deletes a role from the system.
 * @param {String} roleId - ID of the role to delete
 * @returns {Object} - The removed role
 */
const deleteRole = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  // Additional check: Ensure no users are assigned this role before deleting
  return await role.remove();
};

module.exports = { createRoles, addRole, updateRole, deleteRole };
