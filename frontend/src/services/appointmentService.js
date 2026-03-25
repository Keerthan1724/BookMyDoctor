import API from "./api";

export const getAppointments = () => {
  return API.get("appointments/");
};

export const createAppointment = (data) => {
  return API.post("appointments/", data);
};

export const updateAppointment = (id, data) => {
  return API.patch(`appointments/${id}/`, data);
};

export const cancelAppointment = (id) => {
  return API.delete(`appointments/${id}/`);
};