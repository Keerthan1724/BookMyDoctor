import { useEffect, useState } from "react";
import DoctorCard from "../DoctorCard";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../services/doctorService";

function TopDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors()
      .then((res) => {
        // Works whether pagination is ON or OFF
        const allDoctors = Array.isArray(res.data)
          ? res.data
          : res.data.results;

        const topRated = allDoctors
          .sort((a, b) => b.average_rating - a.average_rating)
          .slice(0, 8);

        setDoctors(topRated);
      })
      .catch((err) => console.error("Doctor fetch error:", err));
  }, []);

  const handleClick = (id) => {
    navigate(`/doctordetails/${id}`);
  };

  const handleShowMore = () => {
    navigate("/doctors");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-gray-800 dark:text-white">
        Top Doctors
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-8">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onClick={() => handleClick(doctor.id)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleShowMore}
          className="bg-primary hover:bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg transition"
        >
          Show More
        </button>
      </div>
    </section>
  );
}

export default TopDoctors;
