import DateBar from "./DateBar";

const AvailabilityBar = ({
  isAvailable,
  toggleAvailability,
  dates,
  setDates,
  selectedDate,
  setSelectedDate,
  filteredSlots,
  formatTime,
  showMenu,
  handleMenuToggle,
  handleHoldClick,
  handleDeleteClick,
  openAddPopup,
  openDefaultPopup,
}) => {
  return (
    <div className="surface-card space-y-5 p-4 sm:p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <span className="font-medium">Available</span>

        <div
          onClick={toggleAvailability}
          className={`flex h-7 w-14 cursor-pointer items-center rounded-full p-1 ${
            isAvailable ? "bg-primary" : "bg-slate-400"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white transition ${
              isAvailable ? "translate-x-7" : ""
            }`}
          />
        </div>
      </div>

      <DateBar
        dates={dates}
        setDates={setDates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="max-h-[250px] overflow-y-auto space-y-2">
        {filteredSlots.map((slot) => (
          <div
            key={slot.id}
            className="flex justify-between items-center border rounded-lg px-3 py-2"
          >
            <span>{formatTime(slot.start_time)}</span>

            <button onClick={(e) => handleMenuToggle(e, slot.id)}>
              ...
            </button>

            {showMenu === slot.id && (
              <div className="absolute right-4 mt-2 bg-white dark:bg-bgDark shadow rounded-lg text-sm">
                <button
                  onClick={(e) => handleHoldClick(e, slot)}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100  dark:hover:bg-black"
                >
                  {slot.is_held ? "Release" : "Hold"}
                </button>

                <button
                  onClick={(e) => handleDeleteClick(e, slot.id)}
                  className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100 dark:hover:bg-black"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={openAddPopup}
        className="w-full bg-green-500 text-white py-2 rounded-lg"
      >
        + Add Slots
      </button>

      <button
        onClick={openDefaultPopup}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Use Default Slots
      </button>
    </div>
  );
};

export default AvailabilityBar;