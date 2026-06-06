const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setAuthTokens = ({ access, refresh }) => {
  setAccessToken(access);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const setStoredUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  sessionStorage.removeItem(USER_KEY);
};

export const clearSession = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  clearStoredUser();
};

