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

export const getDateGroup = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Yesterday";
  } else {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
};
;

export const groupAppointmentsByDate = (appointments) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups = {};

  appointments.forEach((appointment) => {
    const dateStr = appointment.slot?.date;
    if (!dateStr) return;

    const apptDate = new Date(dateStr);
    apptDate.setHours(0, 0, 0, 0);

    let display;

    if (apptDate.getTime() === today.getTime()) {
      display = "Today";
    } else if (apptDate.getTime() === yesterday.getTime()) {
      display = "Yesterday";
    } else {
      display = formatDateNumeric(dateStr);
    }

    if (!groups[display]) {
      groups[display] = [];
    }

    groups[display].push(appointment);
  });

  const ordered = {};

  if (groups["Today"]) ordered["Today"] = groups["Today"];
  if (groups["Yesterday"]) ordered["Yesterday"] = groups["Yesterday"];

  Object.keys(groups)
    .filter((k) => k !== "Today" && k !== "Yesterday")
    .sort((a, b) => {
      const da = new Date(a.split("-").reverse().join("-"));
      const db = new Date(b.split("-").reverse().join("-"));
      return db - da;
    })
    .forEach((k) => {
      ordered[k] = groups[k];
    });

  return ordered;
};