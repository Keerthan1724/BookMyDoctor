const THEME_KEY = "theme";
const DOCTOR_DATES_KEY = "doctor_dates";
const DEFAULT_SLOTS_KEY = "default_slots";

const getJson = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const setJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredTheme = () => {
  return localStorage.getItem(THEME_KEY);
};

export const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const getStoredDoctorDates = () => {
  return getJson(DOCTOR_DATES_KEY);
};

export const setStoredDoctorDates = (dates) => {
  setJson(DOCTOR_DATES_KEY, dates);
};

export const clearStoredDoctorDates = () => {
  localStorage.removeItem(DOCTOR_DATES_KEY);
};

export const getStoredDefaultSlots = () => {
  return getJson(DEFAULT_SLOTS_KEY);
};

export const setStoredDefaultSlots = (slots) => {
  setJson(DEFAULT_SLOTS_KEY, slots);
};

