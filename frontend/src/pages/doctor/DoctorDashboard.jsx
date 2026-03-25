import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";
import DashboardCard from "../../components/DashboardCard";
import { doctorDashboardItems } from "../../data/dashboardItems";
import { getAppointments } from "../../services/appointmentService";
import API from "../../services/api";

const DoctorDashboard = () => {
  const dateScrollRef = useRef();
  const hiddenDateInputRef = useRef();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const [dashboardData, setDashboardData] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [dates, setDates] = useState([]);

  const [showMenu, setShowMenu] = useState(null);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDefaultPopup, setShowDefaultPopup] = useState(false);

  const [tempSlots, setTempSlots] = useState([]);
  const [defaultSlots, setDefaultSlots] = useState([]);

  const [timeInput, setTimeInput] = useState("");

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const validateTime = (time) => {
    const selected = new Date(`${selectedDate}T${time}`);
    const now = new Date();

    if (selected < now) return "Past time not allowed";

    for (let s of filteredSlots) {
      if (s.start_time === time) return "Duplicate slot not allowed";

      const existing = new Date(`${selectedDate}T${s.start_time}`);
      const diff = Math.abs(existing - selected) / (1000 * 60);

      if (diff < 30) return "Minimum 30 mins gap required";
    }

    return "";
  };

  useEffect(() => {
    fetchSlots();
    generateDates();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [slots]);

  useEffect(() => {
    const saved = localStorage.getItem("default_slots");
    if (saved) {
      setDefaultSlots(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const list = [];

    // appointments
    dashboardData?.appointments?.forEach((appt) => {
      if (appt.slot?.date === today) {
        list.push({
          id: appt.id,
          start_time: appt.slot?.start_time,
          label: appt.patient_name || "Patient",
        });
      }
    });

    // held slots
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

  const checkOverflow = () => {
    const el = dateScrollRef.current;
    if (!el) return;

    const isOverflowing = el.scrollWidth > el.clientWidth;

    if (!isOverflowing) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkOverflow();
  }, [dates]);

  const handleScroll = () => {
    checkOverflow();
  };

  const scrollDates = (direction) => {
    const el = dateScrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -150 : 150,
      behavior: "smooth",
    });

    setTimeout(checkOverflow, 300);
  };

  const addDate = () => {
    const lastDate = dates[dates.length - 1];
    const last = new Date(lastDate.full);

    last.setDate(last.getDate() + 1);

    const newDate = {
      full: last.toISOString().split("T")[0],
      day: last.toLocaleDateString("en-US", { weekday: "short" }),
      date: last.getDate(),
    };

    const updated = [...dates, newDate];

    setDates(updated);
    localStorage.setItem("doctor_dates", JSON.stringify(updated));
  };

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

      const today = new Date().toISOString().split("T")[0];
      const todayList = [];

      // 1. Logic to include both Appointments and "Held" slots in the today list
      appointments.forEach((appt) => {
        if (appt.status === "COMPLETED") {
          completedAppointments++;
          totalEarnings += parseFloat(appt.fee);
        }

        if (appt.status === "PENDING" || appt.status === "APPROVED") {
          activeAppointments++;
        }

        if (appt.slot?.date === today) {
          todayList.push({
            id: appt.id,
            start_time: appt.slot?.start_time,
            label: appt.patient_name || "Patient",
          });
        }
      });

      // THEN SORT ONCE
      todayList.sort((a, b) => a.start_time.localeCompare(b.start_time));

      setDashboardData({
        totalEarnings,
        activeAppointments,
        completedAppointments,
      });

      setTodayAppointments(todayList);
    } catch (err) {
      console.log(err);
    }
  };

  const generateDates = () => {
    const saved = localStorage.getItem("doctor_dates");
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (saved) {
      let parsed = JSON.parse(saved);

      // ✅ remove past dates
      parsed = parsed.filter((d) => {
        const dDate = new Date(d.full);
        return dDate >= new Date(todayStr);
      });

      if (parsed.length === 0) {
        localStorage.removeItem("doctor_dates");
        return generateDates(); // regenerate
      }

      setDates(parsed);
      setSelectedDate(parsed[0].full);
      localStorage.setItem("doctor_dates", JSON.stringify(parsed));
      return;
    }

    const arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      arr.push({
        full: d.toISOString().split("T")[0],
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
      });
    }

    setDates(arr);
    setSelectedDate(arr[0].full);

    localStorage.setItem("doctor_dates", JSON.stringify(arr));
  };

  const fetchSlots = async () => {
    try {
      const res = await API.get("/availability/");
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
      const res = await API.delete(`/availability/${id}/`);
      console.log("DELETE RES:", res);

      setSlots((prev) => prev.filter((s) => s.id !== id));
      setShowMenu(null);
      fetchDashboard();
    } catch (err) {
      console.log("Delete failed", err.response || err);
    }
  };

  // NEW: Logic to hold a slot for offline patients
  const handleHoldSlot = async (slot) => {
    try {
      const res = await API.patch(`/availability/${slot.id}/`, {
        is_held: !slot.is_held,
      });

      console.log("PATCH RES:", res.data);

      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.data : s)));

      setShowMenu(null);
      fetchDashboard();
    } catch (err) {
      console.log("Error holding slot", err.response || err);
    }
  };

  const addTempSlot = () => {
    if (!timeInput) return;

    const err = validateTime(timeInput);
    if (err) {
      alert(err);
      return;
    }

    const newSlot = {
      start_time: timeInput,
    };

    setTempSlots((prev) =>
      [...prev, newSlot].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    );
    setTimeInput("");
  };

  const saveSlots = async () => {
    if (tempSlots.length === 0) {
      alert("No slots added");
      return;
    }

    try {
      const res = await Promise.all(
        tempSlots.map((slot) =>
          API.post("/availability/", {
            date: selectedDate,
            start_time: slot.start_time,
          }),
        ),
      );

      const newSlots = res.map((r) => r.data);

      setSlots((prev) => [...prev, ...newSlots]);

      setTempSlots([]);
      setShowAddPopup(false);

      fetchDashboard(); // ⭐ IMPORTANT
    } catch (err) {
      console.log(err);
      alert("Failed to save slots");
    }
  };

  const addDefaultSlot = () => {
    if (!timeInput) return;

    const newSlot = {
      start_time: timeInput,
    };

    setDefaultSlots((prev) => {
      const updated = [...prev, newSlot].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      );

      localStorage.setItem("default_slots", JSON.stringify(updated));
      return updated;
    });
    setTimeInput("");
  };

  const applyDefaultSlots = async () => {
    if (defaultSlots.length === 0) return;

    const now = new Date();

    const validDefaults = defaultSlots.filter((slot) => {
      const slotTime = new Date(`${selectedDate}T${slot.start_time}`);
      return slotTime > now;
    });

    await Promise.all(
      filteredSlots.map((s) => API.delete(`/availability/${s.id}/`)),
    );

    const res = await Promise.all(
      validDefaults.map((slot) =>
        API.post("/availability/", {
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
                      <p className="text-sm">{appt.label}</p>
                      <p className="text-xs text-gray-500">
                        {formatTime(appt.start_time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT (bigger availability) */}
          <div className="bg-white p-5 rounded-xl border col-span-1 space-y-5">
            {/* toggle */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Available</span>

              <div
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                  isAvailable ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full ${
                    isAvailable ? "translate-x-6" : ""
                  }`}
                />
              </div>
            </div>

            <div
              className={`${!isAvailable && "opacity-40 pointer-events-none"}`}
            >
              {/* dates */}
              <div className="flex items-center gap-2 mb-4">
                {/* LEFT BUTTON */}
                {showLeft && (
                  <button
                    onClick={() => scrollDates("left")}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {"<"}
                  </button>
                )}

                {/* SCROLLABLE DATES */}
                <div
                  ref={dateScrollRef}
                  onScroll={handleScroll}
                  className="flex gap-2 overflow-hidden flex-1"
                >
                  {dates.map((d, index) => (
                    <div key={d.full} className="relative min-w-[60px]">
                      <div
                        onClick={() => {
                          setSelectedDate(d.full);
                          setShowMenu(null);
                        }}
                        className={`text-center p-2 border rounded cursor-pointer ${
                          selectedDate === d.full ? "bg-primary text-white" : ""
                        }`}
                      >
                        <p className="text-xs">{d.day}</p>
                        <p>{d.date}</p>
                      </div>

                      {/* REMOVE DATE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          const updated = dates.filter((_, i) => i !== index);

                          setDates(updated);
                          localStorage.setItem(
                            "doctor_dates",
                            JSON.stringify(updated),
                          );

                          if (selectedDate === d.full && updated.length > 0) {
                            setSelectedDate(updated[0].full);
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-400 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* + BUTTON (unchanged) */}
                  <button
                    onClick={addDate}
                    className="px-3 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>

                  {/* PICK DATE BUTTON */}
                  <button
                    onClick={() =>
                      hiddenDateInputRef.current?.showPicker?.() ||
                      hiddenDateInputRef.current.click()
                    }
                    className="px-4 flex items-center text-sm font-medium border border-gray-300 rounded-sm bg-white hover:bg-gray-50 transition whitespace-nowrap"
                  >
                    Pick Date
                  </button>

                  {/* HIDDEN DATE INPUT */}
                  <input
                    type="date"
                    ref={hiddenDateInputRef}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;

                      const today = new Date().toISOString().split("T")[0];

                      // ❌ prevent past date
                      if (val < today) {
                        alert("Cannot select past date");
                        return;
                      }

                      if (dates.some((d) => d.full === val)) {
                        alert("Date already exists");
                        return;
                      }

                      const d = new Date(val);

                      const newDate = {
                        full: val,
                        day: d.toLocaleDateString("en-US", {
                          weekday: "short",
                        }),
                        date: d.getDate(),
                      };

                      const updated = [...dates, newDate].sort((a, b) =>
                        a.full.localeCompare(b.full),
                      );

                      setDates(updated);
                      localStorage.setItem(
                        "doctor_dates",
                        JSON.stringify(updated),
                      );
                    }}
                    className="absolute opacity-0 pointer-events-none"
                  />
                </div>

                {/* RIGHT BUTTON */}
                {showRight && (
                  <button
                    onClick={() => scrollDates("right")}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {">"}
                  </button>
                )}
              </div>

              {/* slots */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {filteredSlots.length === 0 && (
                  <p className="text-gray-500 text-center">
                    No slots for this date
                  </p>
                )}

                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex justify-between items-center border px-4 py-3 rounded-lg relative transition ${
                      slot.is_held
                        ? "bg-orange-50 border-orange-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">
                      {formatTime(slot.start_time)}{" "}
                      {slot.is_held && (
                        <span className="text-xs text-orange-600 ml-2">
                          (HELD)
                        </span>
                      )}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ⭐ THIS WAS MISSING
                        setShowMenu(showMenu === slot.id ? null : slot.id);
                      }}
                    >
                      ⋮
                    </button>

                    {showMenu === slot.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-2 top-10 bg-white border rounded shadow text-sm w-[80px] z-50"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHoldSlot(slot);
                          }}
                          className="block w-full text-center px-3 py-2 hover:bg-blue-50 text-blue-600 border-b"
                        >
                          {slot.is_held ? "Release" : "Hold"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(slot.id);
                          }}
                          className="block w-full text-center px-3 py-2 hover:bg-red-50 text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* buttons */}
              <button
                onClick={() => setShowAddPopup(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 my-3 rounded-lg"
              >
                + Add Slots
              </button>

              <button
                onClick={() => setShowDefaultPopup(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Use Default Slots
              </button>
            </div>
          </div>
        </div>

        {/* ADD POPUP */}
        {showAddPopup && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[380px] space-y-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Add Slots</h3>
                <button
                  onClick={() => {
                    setShowAddPopup(false);
                    setTempSlots([]); // clear old slots
                    setTimeInput("");
                  }}
                >
                  ✕
                </button>
              </div>

              {tempSlots.map((s, i) => (
                <div
                  key={i}
                  className="bg-green-50 px-2 py-1 rounded flex justify-between items-center"
                >
                  <span>{s.start_time}</span>
                  <button
                    onClick={() =>
                      setTempSlots((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
                <button
                  onClick={addTempSlot}
                  className="bg-green-500 text-white px-3 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={saveSlots}
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                Save Slots
              </button>
            </div>
          </div>
        )}

        {/* DEFAULT POPUP */}
        {showDefaultPopup && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[380px] space-y-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Default Slots</h3>
                <button onClick={() => setShowDefaultPopup(false)}>✕</button>
              </div>

              {[...defaultSlots]
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((s, i) => (
                  <div
                    key={i}
                    className="bg-blue-50 px-2 py-1 rounded flex justify-between items-center"
                  >
                    <span>{s.start_time}</span>
                    <button
                      onClick={() =>
                        setDefaultSlots((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}

              <div className="flex gap-2">
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
                <button
                  onClick={addDefaultSlot}
                  className="bg-blue-500 text-white px-3 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={applyDefaultSlots}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Apply Default
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorDashboard;
