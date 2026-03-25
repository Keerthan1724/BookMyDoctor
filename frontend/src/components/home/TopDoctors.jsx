import { topDoctors } from "../../data/dummyData";
import DoctorCard from "../DoctorCard";
import { useNavigate } from "react-router-dom";

function TopDoctors() {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/doctordetails/${id}`);
  };

  const handleShowMore = () => {
  navigate("/doctors");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  return (
    <section className="max-w-7xl mx-auto px-6 py-2">
      <h2 className="text-3xl font-bold mb-10 dark:text-white text-gray-800 text-center">
        Top Doctors
      </h2>

      <div className="grid md:grid-cols-4 gap-8 mb-8">
        {topDoctors.slice(0, 8).map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={{
              ...doctor,
              image: doctor.profile_image,
              name: doctor.username,
              speciality: doctor.specialization,
            }}
            onClick={() => handleClick(doctor.id)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleShowMore}
          className="bg-primary hover:bg-blue-500 hover:text-gray-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition"
        >
          Show More
        </button>
      </div>
    </section>
  );
}

export default TopDoctors;