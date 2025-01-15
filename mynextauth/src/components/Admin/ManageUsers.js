/* import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../services/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import "../../styles/ManageUsers.css";
import { handleApiError } from "../Error/errorHandler";
import UserDetailsBox from "./UserDetailsBox"; // Import the UserDetailsBox component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/admin/users/getUsers");
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to fetch users");
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  console.log("in ManageUsers : fetchusers : ", users);
  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/admin/roles/getRoles");
      setRoles(response.data);
    } catch (err) {
      setError("Failed to fetch roles");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role?.name === roleFilter;
      const matchesSearch = searchTerm
        ? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);
  console.log("Filtered Users: ", filteredUsers);

  const handleViewUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    );

  return (
    <Box padding={3} /* className="manage-users" >
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          variant="outlined"
          label="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">All Roles</MenuItem>
          {roles.map((role) => (
            <MenuItem key={role._id} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <TableContainer component={Paper} sx={{ flex: 3, mr: { md: 2 } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Verification Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No users found</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.role?.name || "No Role Assigned"}
                    </TableCell>
                    <TableCell>
                      {user.otpVerified ? "Verified" : "Not Verified"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewUser(user._id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box flex={2} className="user-details" sx={{ mt: { xs: 2, md: 0 } }}>
          {selectedUser ? (
            <UserDetailsBox
              userId={selectedUser._id}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            <Typography>Select a user to view details</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ManageUsers;
 */

import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../services/apiClient";
import axios from "axios"; // Added to ensure `fetchRoles` uses axios
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import "../../styles/ManageUsers.css";
import { handleApiError } from "../Error/errorHandler";
import UserDetailsBox from "./UserDetailsBox";
import { fetchUsers, fetchRoles } from "../Handlers/Usermanagement";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;
      const matchesSearch = searchTerm
        ? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);

  const handleViewUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) {
      console.error("User not found with ID:", userId);
      return;
    }
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          label="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} displayEmpty>
          <MenuItem value="all">All Roles</MenuItem>
          {Array.isArray(roles) && roles.map((role) => (
            <MenuItem key={role._id} value={role.name}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <TableContainer component={Paper} sx={{ flex: 3, mr: { md: 2 } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Verification Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No users found</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role?.name || "No Role Assigned"}</TableCell>
                    <TableCell>{user.otpVerified ? "Verified" : "Not Verified"}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleViewUser(user._id)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box flex={2} className="user-details" sx={{ mt: { xs: 2, md: 0 } }}>
          {selectedUser ? (
            <UserDetailsBox userId={selectedUser._id} onClose={() => setSelectedUser(null)} />
          ) : (
            <Typography>Select a user to view details</Typography>
          )}
        </Box>
      </Box>
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ManageUsers;
