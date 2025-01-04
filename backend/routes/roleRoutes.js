const express = require('express');
const router = express.Router();
const { addRole, updateRole, deleteRole } = require('../models/UserDetails/roleService');

// Add a new role
router.post('/roles', async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await addRole(name, permissions);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing role
router.put('/roles/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;
    const updates = req.body;
    const updatedRole = await updateRole(roleId, updates);
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a role
router.delete('/roles/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;
    await deleteRole(roleId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
