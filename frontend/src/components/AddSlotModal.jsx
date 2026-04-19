import { useState } from "react";
import { toast } from "./CustomToast";

const AddSlotsModal = ({
  formatTime,
  saveSlots,
  handleCloseAddPopup,
  selectedDate,
  filteredSlots,
}) => {
  const [tempSlots, setTempSlots] = useState([]);
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

  const addTempSlot = () => {
    if (!timeInput) return;

    const exists = tempSlots.some((s) => s.start_time === timeInput);
    if (exists) {
      toast("Slot already added", "warning");
      return;
    }

    const err = validateTime(timeInput);
    if (err) {
      toast(err, "error");
      return;
    }

    const newSlot = { start_time: timeInput };

    setTempSlots((prev) =>
      [...prev, newSlot].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    );

    toast("Slot added", "success");
    setTimeInput("");
  };

  const handleSave = () => {
    saveSlots(tempSlots, setTempSlots);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="surface-elevated w-full max-w-sm p-5 rounded-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Add Slots</h3>
          <button
            onClick={handleCloseAddPopup}
            className="text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {tempSlots.map((s, i) => (
          <div
            key={i}
            className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg flex justify-between items-center"
          >
            <span>{formatTime(s.start_time)}</span>
            <button
              onClick={() =>
                setTempSlots((prev) => prev.filter((_, idx) => idx !== i))
              }
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
            onClick={addTempSlot}
            className="bg-green-500 text-white px-4 rounded-lg"
          >
            +
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white py-2.5 rounded-lg"
        >
          Save Slots
        </button>
      </div>
    </div>
  );
};

export default AddSlotsModal;