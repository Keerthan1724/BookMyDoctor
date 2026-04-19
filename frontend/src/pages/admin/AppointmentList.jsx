import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";
import { getAppointments } from "../../services/appointmentService";
import Avatar from "../../components/Avatar";
import { formatDateNumeric, formatTime12Hour } from "../../utils/formatters";

const statusTabs = [
  "ALL",
  "PENDING",
  "APPROVED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res.data);
    } catch (err) {
      console.log("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "APPROVED") {
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    }

    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
    }

    if (status === "COMPLETED") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    }

    if (status === "CANCELLED" || status === "REJECTED") {
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }

    return "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300";
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "ALL") return true;
    return appointment.status === activeTab;
  });

  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <div className="space-y-4 p-4 md:p-6">
        <h1 className="text-xl font-semibold">Appointments</h1>

        <div className="flex flex-wrap gap-3">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100 text-left dark:bg-gray-800">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Speciality</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Fees</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => {
                  const doctor = appointment.slot?.doctor;
                  const patient = appointment.patient;

                  return (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-200 dark:border-gray-800"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={doctor?.username}
                            image={doctor?.profile_image}
                            alt="doctor"
                            className="h-10 w-10"
                            textClassName="text-sm font-semibold"
                          />

                          <span className="font-medium">
                            {doctor?.username || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 text-gray-600 dark:text-gray-300">
                        {doctor?.specialization || "N/A"}
                      </td>

                      <td className="p-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={patient?.username}
                            image={patient?.profile_image}
                            alt="patient"
                            className="h-10 w-10"
                            textClassName="text-sm font-semibold"
                          />

                          <span>{patient?.username || "N/A"}</span>
                        </div>
                      </td>

                      <td className="p-3 text-gray-600 dark:text-gray-300">
                        {formatDateNumeric(appointment.slot?.date)}
                      </td>

                      <td className="p-3 text-gray-600 dark:text-gray-300">
                        {formatTime12Hour(appointment.slot?.start_time)}
                      </td>

                      <td className="p-3 text-gray-600 dark:text-gray-300">
                        ₹{appointment.fee}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentList;
