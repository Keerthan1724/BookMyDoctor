export const formatDateNumeric = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateCompact = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
};

export const formatDateLong = (value) => {
  if (!value) return "N/A";
  return new Date(value).toDateString();
};

export const formatTime12Hour = (value) => {
  if (!value) return "";

  let [hours, minutes] = value.split(":");
  hours = parseInt(hours, 10);

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};
