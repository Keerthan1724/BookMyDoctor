import { useEffect, useState } from "react";
import { toast } from "./CustomToast";

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
      toast("Default slot already exists", "warning");
      return;
    }

    const err = validateTime(timeInput);
    if (err) {
      toast(err, "error");
      return;
    }

    const newSlot = { start_time: timeInput };

    const updated = [...defaultSlots, newSlot].sort((a, b) =>
      a.start_time.localeCompare(b.start_time),
    );

    setDefaultSlots(updated);
    localStorage.setItem("default_slots", JSON.stringify(updated));

    toast("Default slot added", "success");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="surface-elevated w-full max-w-sm p-5 rounded-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Default Slots</h3>
          <button
            onClick={closeDefaultPopup}
            className="text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {[...defaultSlots]
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map((s, i) => (
            <div
              key={i}
              className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg flex justify-between items-center"
            >
              <span>{formatTime(s.start_time)}</span>
              <button
                onClick={() => handleDeleteSlot(i)}
                className="text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          ))}

        <div className="flex gap-2">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full bg-transparent"
          />
          <button
            onClick={addDefaultSlot}
            className="bg-blue-500 text-white px-4 rounded-lg"
          >
            +
          </button>
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-blue-500 text-white py-2.5 rounded-lg"
        >
          Apply Default
        </button>
      </div>
    </div>
  );
};

export default DefaultSlotsModal;