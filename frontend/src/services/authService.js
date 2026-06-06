import API, { publicAPI } from "./api";

export const registerUser = (data) => {
  return publicAPI.post("auth/register/", data);
};

export const loginUser = (data) => {
  return publicAPI.post("auth/login/", data);
};

export const getProfile = () => {
  return API.get("profile/", { requiresAuth: true });
};

export const getUsers = () => {
  return API.get("users/", { requiresAuth: true });
};

export const updateProfile = (data) => {
  return API.patch("profile/", data, {
    requiresAuth: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = (id, data) => {
  return API.patch(`users/${id}/`, data, {
    requiresAuth: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAccount = () => {
  return API.delete("profile/", { requiresAuth: true });
};

export const deleteUser = (id) => {
  return API.delete(`users/${id}/`, { requiresAuth: true });
};

// ❌ NO AUTH
export const sendOTP = (data) => {
  return publicAPI.post("auth/send-otp/", data);
};

export const verifyOTP = (data) => {
  return publicAPI.post("auth/verify-otp/", data);
};

export const resetPassword = (data) => {
  return publicAPI.post("auth/reset-password/", data);
};
