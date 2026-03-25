import API from "./api";

export const getAvailability = () => {
  return API.get("/availability/");
};

export const createAvailability = (data) => {
  return API.post("/availability/", data);
};

export const updateAvailability = (id, data) => {
  return API.patch(`/availability/${id}/`, data);
};

export const deleteAvailability = (id) => {
  return API.delete(`/availability/${id}/`);
};