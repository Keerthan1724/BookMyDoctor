import API from "./api";

export const createCheckoutSession = (appointmentId) => {
  return API.post("/payments/create-checkout/", {
    appointment_id: appointmentId,
  });
};
