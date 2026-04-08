import { useState } from "react";

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
      alert("Slot already added");
      return;
    }

    const err = validateTime(timeInput);
    if (err) {
      alert(err);
      return;
    }

    const newSlot = { start_time: timeInput };

    setTempSlots((prev) =>
      [...prev, newSlot].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    );

    alert("Slot added");
    setTimeInput("");
  };

  const handleSave = () => {
    saveSlots(tempSlots, setTempSlots);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[380px] space-y-4 max-h-[500px] overflow-y-auto">
        
        <div className="flex justify-between">
          <h3 className="font-semibold">Add Slots</h3>
          <button onClick={handleCloseAddPopup}>✕</button>
        </div>

        {tempSlots.map((s, i) => (
          <div
            key={i}
            className="bg-green-50 px-2 py-1 rounded flex justify-between items-center"
          >
            <span>{formatTime(s.start_time)}</span>
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
          onClick={handleSave}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Save Slots
        </button>

      </div>
    </div>
  );
};

export default AddSlotsModal;