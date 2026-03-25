import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getDoctorDetails } from "../../services/doctorService";
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
  const [selectedDay, setSelectedDay] = useState(0);

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

  const isAvailable =
    doctor.is_active !== undefined
      ? doctor.is_active
      : doctor.available_slots?.length > 0;

  const days = [
    { day: "Today", date: "24 Feb" },
    { day: "Tomorrow", date: "25 Feb" },
    { day: "Thu", date: "26 Feb" },
    { day: "Fri", date: "27 Feb" },
    { day: "Sat", date: "28 Feb" },
  ];

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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Book an Appointment
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {days.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`flex-1 min-w-[110px] py-2 rounded-full border text-sm ${
                  selectedDay === index
                    ? "bg-[#1e73be] text-white border-[#1e73be]"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                }`}
              >
                {item.day}, {item.date}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {doctor.available_slots?.length ? (
              doctor.available_slots.map((slot, i) => (
                <button
                  key={i}
                  className="py-2 rounded-full border text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#1e73be] hover:text-white"
                >
                  {slot}
                </button>
              ))
            ) : (
              <div className="col-span-full py-2 text-center text-gray-400 text-sm">
                Booking Not Available
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button className="w-full md:w-60 py-3 bg-gradient-to-r from-[#1e73be] to-[#155a96] text-white text-sm font-semibold rounded-full shadow-md">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DoctorDetails;
