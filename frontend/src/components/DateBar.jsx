import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "./CustomToast";
import {
  clearStoredDoctorDates,
  getStoredDoctorDates,
  setStoredDoctorDates,
} from "../services/localStorageService";

const DateBar = ({
  dates,
  setDates,
  selectedDate,
  setSelectedDate,
  handleRemoveDateWithSlots,
}) => {
  const dateScrollRef = useRef();
  const hiddenDateInputRef = useRef();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkOverflow = useCallback(() => {
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
  }, []);

  const generateDates = useCallback(() => {
    const saved = getStoredDoctorDates();
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const createDefaultDates = () => {
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
      setStoredDoctorDates(arr);
    };

    if (saved) {
      let parsed = saved;

      parsed = parsed.filter((d) => {
        const dDate = new Date(d.full);
        return dDate >= new Date(todayStr);
      });

      if (parsed.length === 0) {
        clearStoredDoctorDates();
        createDefaultDates();
        return;
      }

      setDates(parsed);
      setSelectedDate(parsed[0].full);
      setStoredDoctorDates(parsed);
      return;
    }

    createDefaultDates();
  }, [setDates, setSelectedDate]);

  useEffect(() => {
    generateDates();
  }, [generateDates]);

  useEffect(() => {
    const frame = requestAnimationFrame(checkOverflow);
    return () => cancelAnimationFrame(frame);
  }, [checkOverflow, dates]);

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
    setStoredDoctorDates(updated);
  };

  const handleRemoveDate = (e, index, fullDate) => {
    e.stopPropagation();
    handleRemoveDateWithSlots(index, fullDate);
  };

  const handleDatePick = (e) => {
    const val = e.target.value;
    if (!val) return;

    const today = new Date().toISOString().split("T")[0];

    if (val < today) {
      toast("Cannot select past date", "error");
      return;
    }

    if (dates.some((d) => d.full === val)) {
      toast("Date already exists", "error");
      return;
    }

    const d = new Date(val);

    const newDate = {
      full: val,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
    };

    const updated = [...dates, newDate].sort((a, b) =>
      a.full.localeCompare(b.full),
    );

    setDates(updated);
    setStoredDoctorDates(updated);
  };

  const handleOpenDatePicker = () => {
    hiddenDateInputRef.current?.showPicker?.() ||
      hiddenDateInputRef.current.click();
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {showLeft && (
        <button
          onClick={() => scrollDates("left")}
          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700"
        >
          {"<"}
        </button>
      )}

      <div
        ref={dateScrollRef}
        onScroll={checkOverflow}
        className="flex gap-2 overflow-hidden flex-1"
      >
        {dates.map((d, index) => (
          <div key={d.full} className="relative min-w-[65px]">
            <div
              onClick={() => setSelectedDate(d.full)}
              className={`text-center p-2 border rounded-md cursor-pointer transition ${
                selectedDate === d.full
                  ? "bg-primary text-white border-primary"
                  : "theme-border hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <p className="text-xs">{d.day}</p>
              <p className="text-sm font-medium">{d.date}</p>
            </div>

            <button
              onClick={(e) => handleRemoveDate(e, index, d.full)}
              className="absolute top-0 right-0 bg-red-400 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={addDate}
          className="px-3 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          +
        </button>

        <button
          onClick={handleOpenDatePicker}
          className="px-3 border rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Pick
        </button>

        <input
          type="date"
          ref={hiddenDateInputRef}
          onChange={handleDatePick}
          className="absolute opacity-0 pointer-events-none"
        />
      </div>

      {showRight && (
        <button
          onClick={() => scrollDates("right")}
          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700"
        >
          {">"}
        </button>
      )}
    </div>
  );
};

export default DateBar;
