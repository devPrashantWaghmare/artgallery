// import React, { useState, useEffect } from "react";
// import axios from "../../services/api";
// import  "../../styles/UserDetailsBox.css";
// const UserDetailsBox = ({ userId, onClose }) => {
//   const [user, setUser] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     // Fetch user details on mount
//     const token = localStorage.getItem('token');
//     axios.get(`/api/admin/users/${userId}`,{
//         headers: { Authorization: `Bearer ${token}` },
//     }).then((response) => {
//       setUser(response.data);
//     });
//   }, [userId]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setUser((prev) => ({
//         ...prev,
//         [name]: checked,
//       }));
//     } else {
//       setUser((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };
//   const handleSave = () => {
//     setIsSaving(true);
//     const token = localStorage.getItem('token');
//     axios
//       .put(`/api/admin/users/${userId}`, user, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(() => {
//         alert('User details updated successfully');
//         onClose(); // Close the box after saving
//       })
//       .catch((error) => {
//         console.error('Error updating user:', error);
//         alert('Failed to update user details');
//       })
//       .finally(() => setIsSaving(false));
//   };
  

//   if (!user) return <p>Loading...</p>;

//   const isEditable = (field) =>
//     ["subadmin", "artist"].includes(user.role.name) &&
//     ["permissions", "verificationStatus", "onboardingStatus"].includes(field);

//   return (
//     <div className="user-details-box">
//       <h2>Edit User Details</h2>
//       <form>
//         <label>
//           Name:
//           <input
//             type="text"
//             name="name"
//             value={user.name}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="email"
//             name="email"
//             value={user.email}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Mobile:
//           <input
//             type="text"
//             name="mobile"
//             value={user.mobile}
//             onChange={handleChange}
//           />
//         </label>

//         {user.role.name === "subadmin" && (
//           <fieldset>
//             <legend>Permissions</legend>
//             {Object.keys(user.permissions).map((key) => (
//               <label key={key}>
//                 {key}:
//                 <input
//                   type="checkbox"
//                   name={`permissions.${key}`}
//                   checked={user.permissions[key]}
//                   onChange={(e) =>
//                     setUser((prev) => ({
//                       ...prev,
//                       permissions: {
//                         ...prev.permissions,
//                         [key]: e.target.checked,
//                       },
//                     }))
//                   }
//                 />
//               </label>
//             ))}
//           </fieldset>
//         )}

//         {user.role.name === "artist" && (
//           <fieldset>
//             <legend>Verification Status</legend>
//             {Object.keys(user.verificationStatus).map((key) => (
//               <label key={key}>
//                 {key}:
//                 <input
//                   type="checkbox"
//                   name={`verificationStatus.${key}`}
//                   checked={user.verificationStatus[key]}
//                   onChange={(e) =>
//                     setUser((prev) => ({
//                       ...prev,
//                       verificationStatus: {
//                         ...prev.verificationStatus,
//                         [key]: e.target.checked,
//                       },
//                     }))
//                   }
//                 />
//               </label>
//             ))}
//           </fieldset>
//         )}
//       </form>
//       <button disabled={isSaving} onClick={handleSave}>
//         {isSaving ? "Saving..." : "Save"}
//       </button>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default UserDetailsBox;
// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Checkbox, Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
// import axios from '../../services/api';

// const UserDetailsBox = ({ userId, onClose }) => {
//   const [user, setUser] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     // Fetch user details on mount
//     const token = localStorage.getItem('token');
//     axios
//       .get(`/api/admin/users/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setUser(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching user details:", error);
//       });
//   }, [userId]);

//   if (!user) {
//     return <Typography>Loading user details...</Typography>;
//   }

//   const handleViewDocuments = () => {
//     // Logic to view submitted documents
//     alert("Viewing documents functionality to be implemented.");
//   };

//   return (
//     <Box p={3} boxShadow={2} bgcolor="white">
//       <Typography variant="h6" gutterBottom>
//         User Details
//       </Typography>
//       <Typography><strong>Name:</strong> {user.name}</Typography>
//       <Typography><strong>Email:</strong> {user.email}</Typography>
//       <Typography><strong>Mobile:</strong> {user.mobile}</Typography>
//       <Typography><strong>Permissions:</strong> {user.role.permissions || 'N/A'}</Typography>

//       {user.verificationStatus && (
//         <>
//           <Typography variant="subtitle1" mt={2}>Verification Status:</Typography>
//           <Table>
//             <TableBody>
//               {Object.entries(user.verificationStatus).map(([key, value]) => (
//                 <TableRow key={key}>
//                   <TableCell>{key.replace(/([A-Z])/g, ' $1')}</TableCell>
//                   <TableCell>
//                     <Checkbox checked={value} disabled />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </>
//       )}

//       {user.onboardingStatus && (
//         <Typography mt={2}>
//           <strong>Onboarding Status:</strong> {user.onboardingStatus}
//         </Typography>
//       )}

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleViewDocuments}
//         sx={{ mt: 2 }}
//       >
//         View Submitted Documents
//       </Button>

//       <Button
//         variant="outlined"
//         color="secondary"
//         onClick={onClose}
//         sx={{ mt: 2, ml: 2 }}
//       >
//         Close
//       </Button>
//     </Box>
//   );
// };

// export default UserDetailsBox;
 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
import axios from '../../services/api';

const UserDetailsBox = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user details on mount
    const token = localStorage.getItem('token');
    axios
      .get(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userData = response.data;
  
        // Merge user-specific permissions with role permissions if needed
        const mergedPermissions = { 
          ...userData.role.permissions, 
          ...userData.permissions 
        };
  
        setUser({
          ...userData,
          permissions: mergedPermissions,
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
    const token = localStorage.getItem('token');
    axios
      .put(`/api/admin/users/${userId}`, { permissions: user.permissions }, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
