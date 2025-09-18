import apiClient from "./api.js";

export function isEmailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function registerUser({ name, email, password }) {
  try {
    const response = await apiClient.register({ name, email, password });
    return { user: response.data.user };
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await apiClient.login({ email, password });
    return { user: response.data.user };
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
}

export async function logoutUser() {
  try {
    await apiClient.logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
}



export async function getCurrentUser() {
  try {
    const response = await apiClient.getCurrentUser();
    return response.data.user;
  } catch (error) {
    // If the API call fails, try to get user from localStorage
    const userFromStorage = apiClient.getCurrentUserFromStorage();
    if (userFromStorage) {
      return userFromStorage;
    }
    throw new Error(error.message || "Failed to get current user");
  }
}

export async function updateProfile(profileData) {
  try {
    const response = await apiClient.updateProfile(profileData);
    
    // Update localStorage with new user data
    if (response.success && response.data.user) {
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update profile");
  }
}

export async function changePassword(passwordData) {
  try {
    const response = await apiClient.changePassword(passwordData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to change password");
  }
}

export function isAuthenticated() {
  return apiClient.isAuthenticated();
}

export function getCurrentUserFromStorage() {
  return apiClient.getCurrentUserFromStorage();
}

export async function deleteAccount() {
  // This would need to be implemented on the backend
  // For now, just logout
  await logoutUser();
}
