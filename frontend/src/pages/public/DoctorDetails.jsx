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

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const formatTime = (time) => {
    let [h, m] = time.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

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

        // filter only this doctor's slots
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

        const booked = res.data.map((a) => a.slot.id); // assuming slot id
        setBookedSlots(booked);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAppointments();
  }, []);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select date and time");
      return;
    }

    try {
      // check auth
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
      alert("Something went wrong while booking");
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
          <p className="text-lg">
            {!doctor ? "Doctor not found." : "Loading..."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-12 pb-24 px-4">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-10 flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0 bg-blue-200 rounded-xl w-52 h-64 flex items-end justify-center overflow-hidden">
              <img
                src={doctor.profile_image || "/default-doctor.png"}
                alt={doctor.username}
                className="w-full h-52 object-contain"
              />
            </div>

            <div className="flex-grow w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {doctor.username}
                  </h1>

                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    MBBS, MD ({doctor.specialization})
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {doctor.experience}+ Years Experience
                  </p>
                </div>

                <div
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isAvailable
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {isAvailable ? "Available" : "Not Available"}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 font-medium mt-4">
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

              <div className="flex justify-between items-center mt-4">
                <p className="flex items-center gap-1 font-semibold text-gray-800 dark:text-white">
                  <BiRupee />
                  {doctor.consultation_fee} Consultation Fee
                </p>

                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold text-gray-800 dark:text-white">
                    {doctor.average_rating || 0}
                  </span>
                  <span className="ml-2 text-gray-400 text-sm">
                    ({doctor.total_reviews || 0}+ Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="mx-10 border-gray-100 dark:border-gray-700" />

          <div className="px-10 py-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              About Doctor
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {doctor.about || "No description available."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 mb-20 px-4">
        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 ${
            !doctor?.is_active ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Book an Appointment
          </h2>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-8">
            {uniqueDates.map((date, index) => {
              const d = new Date(date);

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-16 rounded-lg border cursor-pointer transition ${
                    selectedDate === date
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300"
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

          <div className="grid grid-cols-6 gap-3 mb-8">
            {filteredSlots.length ? (
              filteredSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-full border text-sm ${
                    selectedSlot?.id === slot.id
                      ? "bg-primary text-white"
                      : "bg-gray-50 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {formatTime(slot.start_time)}
                </button>
              ))
            ) : (
              <div className="col-span-full py-2 text-center text-gray-400 text-sm">
                Select a date{" "}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleBooking}
              className="w-full md:w-60 py-3 bg-gradient-to-r from-[#1e73be] to-[#155a96] text-white text-sm font-semibold rounded-full shadow-md"
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
