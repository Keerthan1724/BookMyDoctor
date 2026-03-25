import { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import DoctorCard from "../../components/DoctorCard";
import DoctorFilterBar from "../../components/DoctorFilterBar";
import { getDoctors } from "../../services/doctorService";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

function Doctors() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    specialization: "",
    rating: "",
    city: "",
    availability: false,
    experience: "",
    sort: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const doctorsPerPage = 12;

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) =>
        filters.specialization
          ? doc.specialization === filters.specialization
          : true
      )
      .filter((doc) =>
        filters.rating
          ? Number(doc.average_rating) >= Number(filters.rating)
          : true
      )
      .filter((doc) => (filters.city ? doc.city === filters.city : true))
      .filter((doc) => (filters.availability ? doc.is_active : true))
      .filter((doc) =>
        filters.experience
          ? Number(doc.experience) >= Number(filters.experience)
          : true
      )
      .filter((doc) =>
        searchText
          ? doc.username.toLowerCase().includes(searchText.toLowerCase())
          : true
      );
  }, [filters, searchText, doctors]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getDoctors();
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const newDoctors = filteredDoctors.slice(0, doctorsPerPage * page);
    setDisplayedDoctors(newDoctors);

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        newDoctors.length < filteredDoctors.length
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredDoctors, page]);

  useEffect(() => {
    setPage(1);
  }, [filters, searchText]);

  const handleClick = (id) => {
    navigate(`/doctordetails/${id}`);
  };

  const heading = filters.specialization
    ? `All ${filters.specialization}s`
    : "All Doctors";

  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen">
        <div className="max-w-8xl mx-auto px-20 py-8 flex gap-8">
          <DoctorFilterBar
            filters={filters}
            setFilters={setFilters}
            doctors={doctors}
          />

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
              />
              <h2 className="text-xl font-medium text-textLight dark:text-textDark">
                {heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2"
                >
                  <DoctorCard
                    doctor={{
                      ...doctor,
                      image: doctor.profile_image,
                      name: doctor.username,
                      speciality: doctor.specialization,
                    }}
                    onClick={() => handleClick(doctor.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Doctors;