import API from "./api";

export const registerUser = (data) => {
  return API.post("auth/register/", data);
};

export const loginUser = (data) => {
  return API.post("auth/login/", data);
};

export const getProfile = () => {
  return API.get("profile/");
};

export const updateProfile = (data) => {
  return API.patch("profile/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAccount = () => {
  return API.delete("profile/");
};

export const sendOTP = (data) => {
  return API.post("auth/send-otp/", data);
};

export const verifyOTP = (data) => {
  return API.post("auth/verify-otp/", data);
};

export const resetPassword = (data) => {
  return API.post("auth/reset-password/", data);
};