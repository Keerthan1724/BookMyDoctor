import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import {
  cancelAppointment,
  getAppointments,
} from "../../services/appointmentService";
import Avatar from "../../components/Avatar";
import {
  formatDateCompact,
  formatTime12Hour,
  groupAppointmentsByDate,
} from "../../utils/formatters";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAppointments();
  }, [location]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePay = (appt) => {
    navigate("/payment-preview", {
      state: { appointment: appt },
    });
  };

  const handleRate = (appt) =>
    navigate("/review", {
      state: { background: location, appointment: appt },
    });

  const getStatusStyle = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300";
    if (status === "PENDING")
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300";
    if (status === "CANCELLED")
      return "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300";
    return "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300";
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === "ACTIVE") {
      return appt.status === "PENDING" || appt.status === "APPROVED";
    }
    if (activeTab === "HISTORY") {
      return ["COMPLETED", "CANCELLED", "REJECTED"].includes(appt.status);
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-6">
        {/* ================= TABS ================= */}
        <div className="mb-5 flex flex-wrap gap-2 sm:gap-3">
          {["ALL", "ACTIVE", "HISTORY"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-700 dark:text-slate-200 text-sm sm:text-base">
            Loading appointments...
          </p>
        )}

        {/* EMPTY */}
        {!loading && filteredAppointments.length === 0 && (
          <p className="text-center text-gray-500 dark:text-slate-400 text-sm">
            No appointments found
          </p>
        )}

        {/* ================= LIST ================= */}
        <div className="space-y-5">
          {Object.entries(groupAppointmentsByDate(filteredAppointments)).map(
            ([dateGroup, groupAppointments]) => (
              <div key={dateGroup}>
                {/* DATE GROUP HEADER */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 px-2">
                  {dateGroup}
                </h3>

                {/* APPOINTMENTS FOR THIS DATE */}
                <div className="space-y-3 sm:space-y-4">
                  {groupAppointments.map((appt) => {
                    const slot =
                      typeof appt.slot === "object" ? appt.slot : null;
                    const doctor = slot?.doctor;

                    return (
                      <div
                        key={appt.id}
                        className="relative rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-3 sm:p-5 lg:p-6 shadow-sm transition hover:shadow-md"
                      >
                        {/* STATUS */}
                        <div
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                            appt.status,
                          )}`}
                        >
                          {appt.status}
                        </div>

                        {/* CARD BODY */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* LEFT */}
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <Avatar
                              name={doctor?.username}
                              image={doctor?.profile_image}
                              alt={doctor?.username || "doctor"}
                              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                              textClassName="text-sm sm:text-base lg:text-lg font-semibold"
                            />

                            <div className="min-w-0">
                              <h3 className="truncate text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {doctor?.username || "Doctor"}
                              </h3>

                              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                                {doctor?.specialization || "General Physician"}
                              </p>

                              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-1">
                                {formatDateCompact(slot?.date)} |{" "}
                                {formatTime12Hour(slot?.start_time)}
                              </p>

                              <p className="text-sm font-medium text-gray-800 dark:text-slate-100 mt-1">
                                Rs. {appt.fee}
                              </p>
                            </div>
                          </div>

                          {/* RIGHT ACTIONS */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto lg:items-end">
                            {appt.status === "APPROVED" && (
                              <>
                                {appt.payment_status === "PAID" ? (
                                  <>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-300">
                                      Paid
                                    </span>

                                    <button
                                      onClick={() => handleCancel(appt.id)}
                                      className="w-full sm:w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handlePay(appt)}
                                      className="w-full sm:w-[120px] h-9 bg-green-500 text-white rounded-md text-sm"
                                    >
                                      Pay
                                    </button>

                                    <button
                                      onClick={() => handleCancel(appt.id)}
                                      className="w-full sm:w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                              </>
                            )}

                            {appt.status === "PENDING" && (
                              <button
                                onClick={() => handleCancel(appt.id)}
                                className="w-full sm:w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
                              >
                                Cancel
                              </button>
                            )}

                            {appt.status === "COMPLETED" && (
                              <>
                                {!appt.is_rated ? (
                                  <button
                                    onClick={() => handleRate(appt)}
                                    className="w-full sm:w-[120px] h-9 bg-primary text-white rounded-md text-sm"
                                  >
                                    Rate
                                  </button>
                                ) : (
                                  <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                                    Rating:{" "}
                                    {appt.rating ? `${appt.rating}/5` : "Rated"}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AppointmentHistory;
