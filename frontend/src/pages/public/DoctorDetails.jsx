import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getDoctorDetails } from "../../services/doctorService";
import { getAvailability } from "../../services/availabilityService";
import { getAppointments } from "../../services/appointmentService";
import { AuthContext } from "../../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaStar,
  FaClinicMedical,
  FaPhoneAlt,
} from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { toast } from "../../components/CustomToast";
import Avatar from "../../components/Avatar";
import { formatTime12Hour } from "../../utils/formatters";

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await getDoctorDetails(id);
        setDoctor(res.data);
      } catch (err) {
        console.log(err);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await getAvailability(id);
        setSlots(res.data);

        if (res.data.length > 0) {
          setSelectedDate(res.data[0].date);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchSlots();
  }, [id]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getAppointments();
        const booked = res.data.map((a) => a.slot.id);
        setBookedSlots(booked);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      toast("Please select date and time", "warning");
      return;
    }

    try {
      if (!user) {
        navigate("/login", {
          state: { background: location },
        });
        return;
      }

      navigate("/appointment", {
        state: {
          background: location,
          doctor,
          slot: selectedSlot,
          date: selectedDate,
        },
      });
    } catch (err) {
      console.log(err);
      toast("Something went wrong while booking", "error");
    }
  };

  const now = new Date();

  const isFutureSlot = (slot) => {
    const slotTime = new Date(`${slot.date}T${slot.start_time}`);
    return slotTime > now;
  };

  const isAvailable =
    doctor?.is_active !== undefined
      ? doctor?.is_active
      : doctor?.available_slots?.length > 0;

  const uniqueDates = [
    ...new Set(slots.filter((s) => isFutureSlot(s)).map((s) => s.date)),
  ];

  const filteredSlots = slots
    .filter(
      (s) =>
        s.date === selectedDate &&
        !s.is_held &&
        isFutureSlot(s) &&
        !bookedSlots.includes(s.id),
    )
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  if (loading || !doctor) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-base md:text-lg">
            {!doctor ? "Doctor not found." : "Loading..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 pb-24 pt-6 sm:pt-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl">

          {/* ================= TOP SECTION ================= */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 sm:p-6 md:p-10">

            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:block">
              <div className="bg-blue-200 dark:bg-gray-800 rounded-xl w-40 sm:w-48 md:w-52 h-48 sm:h-56 md:h-64 flex items-end justify-center overflow-hidden">
                <Avatar
                  name={doctor.username}
                  image={doctor.profile_image}
                  alt={doctor.username}
                  className="h-full w-full rounded-none"
                  imageClassName="object-fit bg-blue-200"
                  textClassName="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-4xl font-semibold text-blue-600 shadow-md"
                />
              </div>
            </div>

            <div className="flex-grow w-full">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {doctor.username}
                  </h1>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                    MBBS, MD ({doctor.specialization})
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {doctor.experience}+ Years Experience
                  </p>
                </div>

                <div
                  className={`px-3 py-1 text-xs font-semibold rounded-full w-fit ${
                    isAvailable
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Not Available"}
                </div>

              </div>

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium mt-4">
                {doctor.specialization}
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">

                <p className="flex items-center gap-2">
                  <FaClinicMedical />
                  {doctor.clinic_name}
                </p>

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {doctor.clinic_address}
                </p>

                <p className="flex items-center gap-2">
                  <FaPhoneAlt />
                  +91 {doctor.contact_no || "Not Available"}
                </p>

              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <p className="flex items-center gap-1 font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                  <BiRupee />
                  {doctor.consultation_fee} Consultation Fee
                </p>

                <div className="flex items-center text-sm">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold text-gray-800 dark:text-white">
                    {doctor.average_rating || 0}
                  </span>
                  <span className="ml-2 text-gray-400 text-xs sm:text-sm">
                    ({doctor.total_reviews || 0}+ Reviews)
                  </span>
                </div>

              </div>

            </div>
          </div>

          <hr className="mx-4 sm:mx-10 border-gray-200 dark:border-gray-700" />

          <div className="px-4 sm:px-6 md:px-10 py-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">
              About Doctor
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {doctor.about || "No description available."}
            </p>
          </div>

        </div>
      </div>

      {/* ================= BOOKING SECTION (THEME FIXED) ================= */}
      <div className="mx-auto -mt-6 sm:-mt-10 mb-20 max-w-4xl px-4">

        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 sm:p-8 border border-gray-200 dark:border-gray-700 ${
            !doctor?.is_active ? "opacity-40 pointer-events-none" : ""
          }`}
        >

          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-5">
            Book an Appointment
          </h2>

          {/* DATES */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6">

            {uniqueDates.map((date, index) => {
              const d = new Date(date);

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[55px] h-14 rounded-lg border cursor-pointer transition ${
                    selectedDate === date
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <p className="text-[10px] uppercase">
                    {d.toLocaleString("en-US", { month: "short" })}
                  </p>
                  <p className="text-sm font-semibold">{d.getDate()}</p>
                </div>
              );
            })}

          </div>

          {/* SLOTS */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">

            {filteredSlots.length ? (
              filteredSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-full border text-xs sm:text-sm transition ${
                    selectedSlot?.id === slot.id
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {formatTime12Hour(slot.start_time)}
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 dark:text-gray-500 text-sm">
                Select a date
              </div>
            )}

          </div>

          {/* BUTTON */}
          <div className="flex justify-center">
            <button
              onClick={handleBooking}
              className="w-full sm:w-60 py-3 bg-gradient-to-r from-[#1e73be] to-[#155a96] text-white text-sm font-semibold rounded-full shadow-md"
            >
              Book Appointment
            </button>
          </div>

        </div>
      </div>

    </MainLayout>
  );
}

export default DoctorDetails;
