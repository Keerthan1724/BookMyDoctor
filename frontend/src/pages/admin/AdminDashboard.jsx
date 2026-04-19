import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";
import DashboardCard from "../../components/DashboardCard";
import { adminDashboardItems } from "../../data/dashboardItems";
import { getDoctors } from "../../services/doctorService";
import { getUsers } from "../../services/authService";
import { getAppointments } from "../../services/appointmentService";

const statusPalette = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  COMPLETED: "bg-blue-500",
  CANCELLED: "bg-red-500",
  REJECTED: "bg-slate-500",
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [usersRes, doctorsRes, appointmentsRes] = await Promise.all([
        getUsers(),
        getDoctors(),
        getAppointments(),
      ]);

      const users = usersRes.data || [];
      const doctors = doctorsRes.data || [];
      const appointmentsData = appointmentsRes.data || [];

      const totalRevenue = appointmentsData.reduce((sum, appointment) => {
        if (appointment.status === "COMPLETED" || appointment.payment_status === "PAID") {
          return (
            sum +
            Number(appointment.fee || 0) +
            (appointment.payment_status === "PAID" ? 100 : 0)
          );
        }
        return sum;
      }, 0);

      setDashboardData({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalAppointments: appointmentsData.length,
        totalRevenue,
      });
      setDoctors(doctors);
      setAppointments(appointmentsData);
    } catch (err) {
      console.log("Error fetching admin dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const statusData = useMemo(() => {
    const counts = {
      PENDING: 0,
      APPROVED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      REJECTED: 0,
    };

    appointments.forEach((appointment) => {
      if (counts[appointment.status] !== undefined) {
        counts[appointment.status] += 1;
      }
    });

    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      color: statusPalette[label],
    }));
  }, [appointments]);

  const topStatusValue = Math.max(...statusData.map((item) => item.value), 1);

  const specializationMix = useMemo(() => {
    const colorPalette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

    const specializationCounts = doctors.reduce((acc, doctor) => {
      const key = doctor.specialization || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedItems = Object.entries(specializationCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], index) => ({
        label,
        value,
        color: colorPalette[index % colorPalette.length],
      }));

    const items =
      sortedItems.length > 4
        ? [
            ...sortedItems.slice(0, 4),
            {
              label: "Others",
              value: sortedItems
                .slice(4)
                .reduce((sum, item) => sum + item.value, 0),
              color: "#64748b",
            },
          ]
        : sortedItems;

    const total = items.reduce((sum, item) => sum + item.value, 0);

    return {
      total,
      items,
      gradient:
        total === 0
          ? "conic-gradient(#cbd5e1 0deg 360deg)"
          : (() => {
              let current = 0;
              const segments = items.map((item) => {
                const slice = (item.value / total) * 360;
                const start = current;
                current += slice;
                return `${item.color} ${start}deg ${current}deg`;
              });
              return `conic-gradient(${segments.join(", ")})`;
            })(),
    };
  }, [doctors]);

  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Overview of users, doctors, appointments, and platform performance.
          </p>
        </div>

        <DashboardCard user={dashboardData} items={adminDashboardItems} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="surface-card rounded-xl p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Appointment Status
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Current snapshot
              </span>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading chart...</p>
            ) : (
              <div className="space-y-4">
                {statusData.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {item.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-3 rounded-full ${item.color}`}
                        style={{ width: `${(item.value / topStatusValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="surface-card rounded-xl p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Doctor Specialization Mix
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Quick overview
              </span>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading chart...</p>
            ) : (
              <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex items-center justify-center">
                  <div
                    className="h-52 w-52 rounded-full"
                    style={{ background: specializationMix.gradient }}
                  />
                  <div className="absolute flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner dark:bg-slate-900">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {specializationMix.total}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Doctors
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  {specializationMix.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
