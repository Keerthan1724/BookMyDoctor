import { useEffect, useState } from "react";

const DefaultSlotsModal = ({
  formatTime,
  applyDefaultSlots,
  closeDefaultPopup,
  selectedDate,
  filteredSlots,
  defaultSlots,
  setDefaultSlots,
}) => {
  const [timeInput, setTimeInput] = useState("");

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
    const saved = localStorage.getItem("default_slots");
    if (saved) {
      setDefaultSlots(JSON.parse(saved));
    }
  }, []);

  const addDefaultSlot = () => {
    if (!timeInput) return;

    const exists = defaultSlots.some((s) => s.start_time === timeInput);
    if (exists) {
      alert("Default slot already exists");
      return;
    }

    // ✅ validation added
    const err = validateTime(timeInput);
    if (err) {
      alert(err);
      return;
    }

    const newSlot = { start_time: timeInput };

    const updated = [...defaultSlots, newSlot].sort((a, b) =>
      a.start_time.localeCompare(b.start_time),
    );

    setDefaultSlots(updated);
    localStorage.setItem("default_slots", JSON.stringify(updated));

    alert("Default slot added");
    setTimeInput("");
  };

  const handleApply = () => {
    applyDefaultSlots(defaultSlots);
  };

  const handleDeleteSlot = (index) => {
    const updated = defaultSlots.filter((_, i) => i !== index);
    setDefaultSlots(updated);
    localStorage.setItem("default_slots", JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[380px] space-y-4 max-h-[500px] overflow-y-auto">
        <div className="flex justify-between">
          <h3 className="font-semibold">Default Slots</h3>
          <button onClick={closeDefaultPopup}>✕</button>
        </div>

        {[...defaultSlots]
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map((s, i) => (
            <div
              key={i}
              className="bg-blue-50 px-2 py-1 rounded flex justify-between items-center"
            >
              <span>{formatTime(s.start_time)}</span>
              <button
                onClick={() => handleDeleteSlot(i)}
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
          onClick={handleApply}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Apply Default
        </button>
      </div>
    </div>
  );
};

export default DefaultSlotsModal;
