import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";
import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
} from "../../services/appointmentService";

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

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    if (!time) return "";
    let [h, m] = time.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const getAvatarColor = (username) => {
    const styles = [
      { bg: "#6c5ce7" },
      { bg: "#0984e3" },
      { bg: "#00b894" },
      { bg: "#e84393" },
    ];
    if (!username) return styles[0];
    return styles[username.charCodeAt(0) % styles.length];
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
      <div className="px-8 py-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Appointments</h1>

        {/* FILTER */}
        <div className="flex gap-2 mb-6">
          {["ALL", "REQUESTS", "ACTIVE", "HISTORY"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === item ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-center text-xl font-medium">No appointments</p>
        ) : (
          <div>
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="relative flex items-center justify-between border rounded-xl px-6 py-5 bg-white shadow-sm mb-4 min-h-[110px]"
              >
                {/* 🔥 STATUS BADGE FIXED */}
                <span
                  className={`absolute top-3 right-4 text-xs px-3 py-1 rounded-full font-semibold ${
                    appt.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : appt.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {appt.status}
                </span>

                {/* LEFT */}
                <div className="flex items-center gap-5 w-1/3">
                  {appt.patient?.profile_image ? (
                    <img
                      src={
                        appt.patient.profile_image.startsWith("http")
                          ? appt.patient.profile_image
                          : `http://localhost:8000${appt.patient.profile_image}`
                      }
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                      style={{
                        backgroundColor: getAvatarColor(appt.patient?.username)
                          .bg,
                      }}
                    >
                      {appt.patient?.username?.[0]?.toUpperCase() || "P"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {appt.patient?.username}
                    </p>
                    <p className="text-sm text-black">
                      {appt.patient?.age || "N/A"} yrs
                    </p>
                    <p className="text-sm text-black">
                      {appt.patient?.gender || "N/A"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="w-1/3 flex flex-col text-center justify-center">
                  <p className="font-semibold text-gray-800">
                    {formatDate(appt.slot?.date)}
                  </p>
                  <p className="text-green-700 font-bold">
                    {formatTime(appt.slot?.start_time)}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="w-1/3 flex flex-col items-end gap-2 mt-8">
                  {appt.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(appt.id)}
                        className="w-28 h-9 bg-green-600 text-white rounded-md text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(appt.id)}
                        className="w-28 h-9 border border-red-500 text-red-600 rounded-md text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {appt.status === "APPROVED" && (
                    <>
                      <button
                        onClick={() => handleComplete(appt.id)}
                        className="w-28 h-9 bg-blue-600 text-white rounded-md text-sm font-medium"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="w-28 h-9 border border-red-500 text-red-600 rounded-md text-sm font-medium"
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
                      className="w-28 h-9 bg-blue-600 text-white rounded-md text-sm font-medium"
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
