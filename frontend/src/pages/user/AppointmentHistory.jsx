import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  getAppointments,
  cancelAppointment,
} from "../../services/appointmentService";
import { createCheckoutSession } from "../../services/paymentService";
import { useNavigate, useLocation } from "react-router-dom";

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

  const handlePay = async (id) => {
    try {
      const res = await createCheckoutSession(id);

      const { session_id, publishable_key } = res.data;

      const stripe = window.Stripe(publishable_key);

      await stripe.redirectToCheckout({
        sessionId: session_id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRate = (appt) =>
    navigate("/review", {
      state: { background: location, appointment: appt },
    });

  const formatDate = (date) => {
    if (!date) return "N/A";

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

  const getStatusStyle = (status) => {
    if (status === "APPROVED") return "bg-green-100 text-green-600";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-600";
    if (status === "CANCELLED") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (activeTab === "ACTIVE") {
      return appt.status === "PENDING" || appt.status === "APPROVED";
    }
    if (activeTab === "HISTORY") {
      return appt.status === "COMPLETED" || appt.status === "CANCELLED";
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {["ALL", "ACTIVE", "HISTORY"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p className="text-center">Loading appointments...</p>}

        {!loading && filteredAppointments.length === 0 && (
          <p className="text-center text-gray-500">No appointments found</p>
        )}

        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white relative border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                  appt.status,
                )}`}
              >
                {appt.status}
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* LEFT */}
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={
                      appt.slot?.doctor?.profile_image || "/default-doctor.png"
                    }
                    alt="doctor"
                    className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                  />

                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {appt.slot?.doctor?.username || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appt.slot?.doctor?.specialization || "General Physician"}
                    </p>

                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      <span className="font-medium">
                        {formatDate(appt.slot?.date)}
                      </span>
                      {" • "}
                      <span>{formatTime(appt.slot?.start_time)}</span>
                    </div>

                    <p className="font-medium text-gray-800">₹{appt.fee}</p>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col items-end gap-2 pt-8">
                  {appt.status === "APPROVED" && (
                    <>
                      {appt.payment_status === "PAID" ? (
                        <>
                          <span className="text-green-600 font-semibold text-md">
                            Paid
                          </span>

                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="w-full max-w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePay(appt.id)}
                            className="w-full max-w-[120px] h-9 bg-green-500 text-white rounded-md text-sm"
                          >
                            Pay
                          </button>

                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="w-full max-w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
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
                      className="w-full max-w-[120px] h-9 border border-red-500 text-red-500 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  )}

                  {appt.status === "COMPLETED" && (
                    <>
                      {!appt.is_rated ? (
                        <button
                          onClick={() => handleRate(appt)}
                          className="w-full max-w-[120px] h-9 bg-primary text-white rounded-md text-sm"
                        >
                          Rate
                        </button>
                      ) : (
                        <div className="w-full text-right h-9 text-gray-600 text-sm">
                          ⭐ {appt.rating ? `${appt.rating}/5` : "Rated"}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AppointmentHistory;
