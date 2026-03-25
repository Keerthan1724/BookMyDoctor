import API from "./api";

export const createCheckoutSession = (data) => {
  return API.post("payments/create-checkout/", data);
};