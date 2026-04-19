import API from "./api";

export const getDoctors = () => {
  return API.get("doctors/");
};

export const getDoctorDetails = (id) => {
  return API.get(`doctors/${id}/`);
};

export const addDoctor = (data) => {
  return API.post("doctors/", data);
};

export const updateDoctor = (id, data) => {
  const config =
    data instanceof FormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined;

  return API.patch(`doctors/${id}/`, data, config);
};

export const deleteDoctor = (id) => {
  return API.delete(`doctors/${id}/`);
};
