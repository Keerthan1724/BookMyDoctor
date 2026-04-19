import { useContext, useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";
import DashboardCard from "../../components/DashboardCard";
import AvailabilityBar from "../../components/AvailabilityBar";
import AddSlotsModal from "../../components/AddSlotModal";
import DefaultSlotsModal from "../../components/DefaultSlotsModal";
import { doctorDashboardItems } from "../../data/dashboardItems";
import { getAppointments } from "../../services/appointmentService";
import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityslots,
} from "../../services/availabilityService";
import { getDoctors, updateDoctor } from "../../services/doctorService";
import { toast } from "../../components/CustomToast";
import { AuthContext } from "../../context/AuthContext";
import { formatTime12Hour } from "../../utils/formatters";

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);

  const [showMenu, setShowMenu] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDefaultPopup, setShowDefaultPopup] = useState(false);

  const [defaultSlots, setDefaultSlots] = useState([]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchDoctorProfile();
    fetchSlots();
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [slots]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const list = [];

    dashboardData?.appointments?.forEach((appt) => {
      if (appt.slot?.date === today) {
        list.push({
          id: appt.id,
          start_time: appt.slot?.start_time,
          label: appt.patient_name || "Patient",
        });
      }
    });

    slots.forEach((slot) => {
      if (slot.date === today && slot.is_held) {
        list.push({
          id: `held-${slot.id}`,
          start_time: slot.start_time,
          label: "Offline Reservation (Held)",
        });
      }
    });

    list.sort((a, b) => a.start_time.localeCompare(b.start_time));

    setTodayAppointments(list);
  }, [slots, dashboardData]);

  const fetchDashboard = async () => {
    try {
      const res = await getAppointments();
      const appointments = res.data;

      let totalEarnings = 0;
      let activeAppointments = 0;
      let completedAppointments = 0;

      appointments.forEach((appt) => {
        if (appt.status === "COMPLETED") {
          completedAppointments++;
          totalEarnings += parseFloat(appt.fee);
        }

        if (appt.status === "PENDING" || appt.status === "APPROVED") {
          activeAppointments++;
        }
      });

      setDashboardData({
        totalEarnings,
        activeAppointments,
        completedAppointments,
        appointments,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctorProfile = async () => {
    try {
      const res = await getDoctors();
      const currentDoctor = res.data.find((doctor) => doctor.email === user?.email);

      if (currentDoctor) {
        setDoctorId(currentDoctor.id);
        setIsAvailable(currentDoctor.is_active !== false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await getAvailabilityslots();
      const now = new Date();

      const validSlots = res.data.filter((slot) => {
        const slotTime = new Date(`${slot.date}T${slot.start_time}`);
        return slotTime > now;
      });

      setSlots(validSlots);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredSlots = slots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleDelete = async (id) => {
    try {
      await deleteAvailability(id);
      toast("Slot deleted", "success");

      setSlots((prev) => prev.filter((s) => s.id !== id));
      setShowMenu(null);
    } catch (err) {
      console.log("Delete failed", err.response || err);
    }
  };

  const handleHoldSlot = async (slot) => {
    try {
      const res = await updateAvailability(slot.id, {
        is_held: !slot.is_held,
      });

      toast(slot.is_held ? "Slot released" : "Slot held", "success");

      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.data : s)));

      setShowMenu(null);
    } catch (err) {
      console.log("Error holding slot", err.response || err);
      toast(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.[0] ||
          "Booked slots cannot be held or released.",
        "error",
      );
    }
  };

  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    setShowMenu((prev) => (prev === id ? null : id));
  };

  const handleHoldClick = (e, slot) => {
    e.stopPropagation();
    handleHoldSlot(slot);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    handleDelete(id);
  };

  const handleAvailabilityToggle = async () => {
    if (!doctorId) return;

    const nextStatus = !isAvailable;
    setIsAvailable(nextStatus);

    try {
      const res = await updateDoctor(doctorId, { is_active: nextStatus });
      setIsAvailable(res.data.is_active !== false);
      toast(
        res.data.is_active ? "You are now available" : "You are now unavailable",
        "success",
      );
    } catch (err) {
      console.log(err);
      setIsAvailable((prev) => !prev);
      toast("Failed to update availability status", "error");
    }
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const saveSlots = async (tempSlots, setTempSlots) => {
    if (!tempSlots || tempSlots.length === 0) {
      toast("No slots added", "warning");
      return;
    }

    try {
      const res = await Promise.all(
        tempSlots.map((slot) =>
          createAvailability({
            date: selectedDate,
            start_time: slot.start_time,
          }),
        ),
      );

      const newSlots = res.map((r) => r.data);

      setSlots((prev) => [...prev, ...newSlots]);

      setTempSlots([]);
      setShowAddPopup(false);

      toast("Slots saved successfully", "success");
    } catch (err) {
      toast("Failed to save slots", "error");
    }
  };

  const applyDefaultSlots = async (defaultSlots) => {
    toast("Default slots applied", "success");

    if (defaultSlots.length === 0) return;

    const now = new Date();

    const validDefaults = defaultSlots.filter((slot) => {
      const slotTime = new Date(`${selectedDate}T${slot.start_time}`);
      return slotTime > now;
    });

    await Promise.all(filteredSlots.map((s) => deleteAvailability(s.id)));

    const res = await Promise.all(
      validDefaults.map((slot) =>
        createAvailability({
          date: selectedDate,
          start_time: slot.start_time,
        }),
      ),
    );

    setSlots((prev) => [
      ...prev.filter((s) => s.date !== selectedDate),
      ...res.map((r) => r.data),
    ]);

    setShowDefaultPopup(false);
  };

  return (
    <AdminLayout sidebarItems={doctorSidebar}>
      <div className="p-3 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Dashboard</h2>

        <DashboardCard user={dashboardData} items={doctorDashboardItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="surface-card p-4 sm:p-5 rounded-xl">
            <h2 className="text-base sm:text-lg font-semibold mb-4 theme-text">
              Today's Schedule
            </h2>

            {todayAppointments.length === 0 ? (
              <p className="theme-text-muted text-sm">No appointments</p>
            ) : (
              todayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`p-3 rounded-lg mb-2 flex items-center gap-3 border transition ${
                    appt.label.includes("Offline")
                      ? "bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30"
                      : "bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0">
                    {appt.label[0]}
                  </div>

                  <div>
                    <p className="text-sm sm:text-base font-semibold theme-text">
                      {formatTime12Hour(appt.start_time)}
                    </p>
                    <p className="text-xs sm:text-sm theme-text-muted">
                      {appt.label}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <AvailabilityBar
            isAvailable={isAvailable}
            toggleAvailability={handleAvailabilityToggle}
            dates={dates}
            setDates={setDates}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredSlots={filteredSlots}
            formatTime={formatTime12Hour}
            showMenu={showMenu}
            handleMenuToggle={handleMenuToggle}
            handleHoldClick={handleHoldClick}
            handleDeleteClick={handleDeleteClick}
            openAddPopup={() => setShowAddPopup(true)}
            openDefaultPopup={() => setShowDefaultPopup(true)}
          />
        </div>

        {showAddPopup && (
          <AddSlotsModal
            saveSlots={saveSlots}
            formatTime={formatTime12Hour}
            handleCloseAddPopup={handleCloseAddPopup}
            selectedDate={selectedDate}
            filteredSlots={filteredSlots}
          />
        )}

        {showDefaultPopup && (
          <DefaultSlotsModal
            formatTime={formatTime12Hour}
            applyDefaultSlots={applyDefaultSlots}
            closeDefaultPopup={() => setShowDefaultPopup(false)}
            selectedDate={selectedDate}
            filteredSlots={filteredSlots}
            defaultSlots={defaultSlots}
            setDefaultSlots={setDefaultSlots}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorDashboard;
