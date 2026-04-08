import { useEffect, useState, useRef } from "react";
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

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);

  const [isAvailable, setIsAvailable] = useState(true);
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
    fetchSlots();
  }, []);

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

  const formatTime = (time) => {
    if (!time) return "";
    let [h, m] = time.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

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
      console.log("DELETE RES:", id);
      alert("Slot deleted");

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

      console.log("PATCH RES:", res.data);
      alert(slot.is_held ? "Slot released" : "Slot held");

      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.data : s)));

      setShowMenu(null);
    } catch (err) {
      console.log("Error holding slot", err.response || err);
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

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  const saveSlots = async (tempSlots, setTempSlots) => {
    if (!tempSlots || tempSlots.length === 0) {
      alert("No slots added");
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

      alert("Slots saved successfully");
    } catch (err) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          "Failed to save slots",
      );
    }
  };

  const applyDefaultSlots = async (defaultSlots) => {
    alert("Default slots applied");

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

  const handleRemoveDateWithSlots = async (index, fullDate) => {
    try {
      // delete all slots of that date
      const slotsToDelete = slots.filter((slot) => slot.date === fullDate);

      await Promise.all(
        slotsToDelete.map((slot) => deleteAvailability(slot.id)),
      );

      // update slots state
      setSlots((prev) => prev.filter((s) => s.date !== fullDate));

      // update dates
      const updated = dates.filter((_, i) => i !== index);
      setDates(updated);
      localStorage.setItem("doctor_dates", JSON.stringify(updated));

      // fix selected date
      if (selectedDate === fullDate && updated.length > 0) {
        setSelectedDate(updated[0].full);
      }
    } catch (err) {
      console.log("Delete date slots failed", err);
    }
  };

  return (
    <AdminLayout sidebarItems={doctorSidebar}>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <DashboardCard user={dashboardData} items={doctorDashboardItems} />

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT (smaller) */}
          <div className="bg-white p-5 rounded-xl border md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>

            {todayAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments</p>
            ) : (
              todayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`border p-3 rounded mb-2 ${appt.label.includes("Offline") ? "bg-orange-50 border-orange-200" : "bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                      {appt.label[0]}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {formatTime(appt.start_time)}
                      </p>
                      <p className="text-sm text-gray-500">{appt.label}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT (bigger availability) */}
          <AvailabilityBar
            isAvailable={isAvailable}
            toggleAvailability={() => setIsAvailable((prev) => !prev)}
            dates={dates}
            setDates={setDates}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredSlots={filteredSlots}
            formatTime={formatTime}
            showMenu={showMenu}
            handleMenuToggle={handleMenuToggle}
            handleHoldClick={handleHoldClick}
            handleDeleteClick={handleDeleteClick}
            openAddPopup={() => setShowAddPopup(true)}
            openDefaultPopup={() => setShowDefaultPopup(true)}
            handleRemoveDateWithSlots={handleRemoveDateWithSlots}
          />
        </div>

        {/* ADD POPUP */}
        {showAddPopup && (
          <AddSlotsModal
            saveSlots={saveSlots}
            formatTime={formatTime}
            handleCloseAddPopup={handleCloseAddPopup}
            selectedDate={selectedDate}
            filteredSlots={filteredSlots}
          />
        )}

        {/* DEFAULT POPUP */}
        {showDefaultPopup && (
          <DefaultSlotsModal
            formatTime={formatTime}
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
