import { publicAPI } from "./api";

export const sendContactMessage = (data) => {
  return publicAPI.post("/contact/", data);
};

