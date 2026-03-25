import API from "./api";

export const getReviews = () => {
  return API.get("reviews/");
};

export const addReview = (data) => {
  return API.post("reviews/", data);
};

