export const buildFormDataFromObject = (obj) => {
  const fd = new FormData();
  Object.keys(obj).forEach((k) => fd.append(k, obj[k]));
  return fd;
};

export const validateProfileForm = (form, toast) => {
  if (form.username.trim().length < 3) {
    toast("Username must be at least 3 characters", "error");
    return false;
  }

  if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
    toast("Phone must be 10 digits", "error");
    return false;
  }

  if (form.age && form.age <= 0) {
    toast("Age must be greater than 0", "error");
    return false;
  }

  return true;
};

export const calculateDashboardStats = (appointments) => {
  let totalSpent = 0;
  let upcoming = 0;
  let completed = 0;

  appointments.forEach((a) => {
    if (a.payment_status === "PAID" || a.status === "COMPLETED") {
      totalSpent += Number(a.fee || 0);
    }

    if (a.status === "PENDING" || a.status === "APPROVED") {
      upcoming += 1;
    }

    if (a.status === "COMPLETED") {
      completed += 1;
    }
  });

  return {
    totalBookings: appointments.length,
    totalSpent,
    upcoming,
    completed,
  };
};