import apiClient from "../../services/apiClient"; // Adjust the path according to your project structure

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/api/users/getUsers");
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    throw new Error("Unable to fetch users. Please try again later.");
  }
};

//Fetch all roles
export const fetchRoles = async () => {
  try {
    const response = await apiClient.get("/api/roles/getRoles");
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch roles:", error.message);
    throw new Error("Unable to fetch roles. Please try again later.");
  }
};



// Filter and search users
export const filterUsers = (users, roleFilter = "all", searchTerm = "") => {
  return users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;
    const matchesSearch = searchTerm
      ? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });
};

// Get user by ID
export const getUserById = (users, userId) => {
  const user = users.find((u) => u._id === userId);
  if (!user) {
    console.error("User not found with ID:", userId);
    return null;
  }
  return user;
};

// Get a list of filtered users (example usage)
export const fetchFilteredUsers = async (roleFilter, searchTerm) => {
  const users = await fetchUsers();
  return filterUsers(users, roleFilter, searchTerm);
};

// Generic error handling function (optional helper)
export const handleApiError = (error) => {
  console.error("API error:", error.message);
  return error.response?.data?.message || "An error occurred. Please try again.";
};
