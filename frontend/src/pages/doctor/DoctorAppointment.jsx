import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";
import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
} from "../../services/appointmentService";
import Avatar from "../../components/Avatar";
import { formatDateCompact, formatTime12Hour } from "../../utils/formatters";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateAppointment(id, { status: "APPROVED" });
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateAppointment(id, { status: "REJECTED" });
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateAppointment(id, { status: "COMPLETED" });
      fetchAppointments();
    } catch (err) {
      console.log(err);
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

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "ALL") return true;
    if (filter === "REQUESTS") return appt.status === "PENDING";
    if (filter === "ACTIVE") return appt.status === "APPROVED";
    if (filter === "HISTORY")
      return ["COMPLETED", "CANCELLED", "REJECTED"].includes(appt.status);
    return true;
  });

  return (
    <AdminLayout sidebarItems={doctorSidebar}>
      <div className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-6xl mx-auto">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
          Appointments
        </h1>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
          {["ALL", "REQUESTS", "ACTIVE", "HISTORY"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border theme-border ${
                filter === item
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-slate-800 theme-text-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <p className="theme-text-muted">Loading...</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-center text-base sm:text-lg font-medium theme-text-muted">
            No appointments
          </p>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="relative surface-card p-4 sm:p-5 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0"
              >
                {/* STATUS */}
                <span
                  className={`absolute top-2 right-2 sm:top-3 sm:right-4 text-xs w-24 text-center py-1 rounded-full font-semibold ${
                    appt.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : appt.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {appt.status}
                </span>

                {/* LEFT */}
                <div className="flex items-center gap-3 sm:gap-5 md:w-1/3">
                  <Avatar
                    name={appt.patient?.username}
                    image={appt.patient?.profile_image}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    textClassName="text-sm sm:text-base font-semibold"
                  />

                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {appt.patient?.username}
                    </p>
                    <p className="text-xs sm:text-sm theme-text-muted">
                      {appt.patient?.age || "N/A"} yrs
                    </p>
                    <p className="text-xs sm:text-sm theme-text-muted">
                      {appt.patient?.gender || "N/A"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="md:w-1/3 flex flex-col md:items-center text-left md:text-center">
                  <p className="font-semibold text-sm sm:text-base">
                    {formatDateCompact(appt.slot?.date)}
                  </p>
                  <p className="text-green-600 font-semibold text-sm sm:text-base">
                    {formatTime12Hour(appt.slot?.start_time)}
                  </p>
                  {appt.payment_status === "PAID" && (
                    <span className="mt-1 inline-flex w-fit rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Paid
                    </span>
                  )}
                </div>

                {/* RIGHT */}
                <div className="md:w-1/3 flex flex-wrap md:flex-col md:items-end gap-2 mt-2 md:mt-6">
                  {appt.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(appt.id)}
                        className="px-3 sm:px-4 h-9 bg-green-600 text-white text-xs sm:text-sm rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(appt.id)}
                        className="px-3 sm:px-4 h-9 border border-red-500 text-red-600 text-xs sm:text-sm rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {appt.status === "APPROVED" && (
                    <>
                      <button
                        onClick={() => handleComplete(appt.id)}
                        className="px-3 sm:px-4 h-9 bg-blue-600 text-white text-xs sm:text-sm rounded-lg"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="px-3 sm:px-4 h-9 border border-red-500 text-red-600 text-xs sm:text-sm rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {appt.status === "COMPLETED" && (
                    <button
                      onClick={() =>
                        navigate(`/view-review/${appt.id}`, {
                          state: { background: location, appointment: appt },
                        })
                      }
                      className="px-3 sm:px-4 h-9 bg-blue-600 text-white text-xs sm:text-sm rounded-lg"
                    >
                      View Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorAppointment;
