 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
import apiClient from '../../services/apiClient';

const UserDetailsBox = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user details on mount
    apiClient
      .get(`/api/admin/users/${userId}`)
      .then((response) => {
        const userData = response.data;
  
        // Merge user-specific permissions with role permissions if needed
        const mergedPermissions = { 
          ...userData.role.permissions, 
          ...userData.permissions 
        };
  
        setUser({
          ...userData,
          permissions: userData.role.permissions,
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user details. Please try again.");
      });
  }, [userId]);
  
  // Log user after it's set
  useEffect(() => {
    if (user) {
      console.log("User in UserDetailsBox:", user);
    }
  }, [user]);

  const handlePermissionChange = (permissionKey) => {
    console.log("handlePermissionChange : ",permissionKey);
    if (!user.permissions || !(permissionKey in user.permissions)) {
      alert("Invalid permission key");
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      permissions: {
        ...prevUser.permissions,
        [permissionKey]: !prevUser.permissions[permissionKey],
      },
    }));
  };

  const handleSave = () => {
    if (!user || !user.permissions) {
      alert("Invalid user data. Unable to save changes.");
      return;
    }

    setIsSaving(true);
    apiClient
      .put(`/api/admin/users/${userId}`, { permissions: user.permissions })
      .then(() => {
        alert("Permissions updated successfully");
      })
      .catch((error) => {
        console.error("Error updating permissions:", error);
        alert("Failed to update permissions. Please try again.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!user) {
    return <Typography>Loading user details...</Typography>;
  }

  return (
    <Box p={3} boxShadow={2} bgcolor="white">
      <Typography variant="h6" gutterBottom>
        User Details
      </Typography>
      <Typography><strong>Name:</strong> {user.name}</Typography>
      <Typography><strong>Email:</strong> {user.email}</Typography>
      <Typography><strong>Mobile:</strong> {user.mobile}</Typography>

      {user.permissions ? (
        <>
          <Typography variant="subtitle1" mt={2}>Permissions:</Typography>
          <Table>
            <TableBody>
              {Object.entries(user.permissions).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!value}
                      onChange={() => handlePermissionChange(key)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <Typography>No permissions found for this user.</Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={isSaving}
        sx={{ mt: 2 }}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>

      <Button
        variant="outlined"
        color="secondary"
        onClick={onClose}
        sx={{ mt: 2, ml: 2 }}
      >
        Close
      </Button>
    </Box>
  );
};

export default UserDetailsBox;
