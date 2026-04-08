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
  handleRemoveDateWithSlots,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border col-span-1 space-y-5">
      <div className="flex justify-between items-center">
        <span className="font-medium">Available</span>

        <div
          onClick={toggleAvailability}
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

      <div className={`${!isAvailable && "opacity-40 pointer-events-none"}`}>
        {/* dates */}
        <DateBar
          dates={dates}
          setDates={setDates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleRemoveDateWithSlots={handleRemoveDateWithSlots}
        />

        {/* slots */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {filteredSlots.length === 0 && (
            <p className="text-gray-500 text-center">No slots for this date</p>
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
                {formatTime(slot.start_time)}
                {slot.is_held && (
                  <span className="text-xs text-orange-600 ml-2">(HELD)</span>
                )}
              </span>

              <button onClick={(e) => handleMenuToggle(e, slot.id)}>⋮</button>

              {showMenu === slot.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-2 top-10 bg-white border rounded shadow text-sm w-[80px] z-50"
                >
                  <button
                    onClick={(e) => handleHoldClick(e, slot)}
                    className="block w-full text-center px-3 py-2 hover:bg-blue-50 text-blue-600 border-b"
                  >
                    {slot.is_held ? "Release" : "Hold"}
                  </button>

                  <button
                    onClick={(e) => handleDeleteClick(e, slot.id)}
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
          onClick={openAddPopup}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 my-3 rounded-lg"
        >
          + Add Slots
        </button>

        <button
          onClick={openDefaultPopup}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Use Default Slots
        </button>
      </div>
    </div>
  );
};

export default AvailabilityBar;