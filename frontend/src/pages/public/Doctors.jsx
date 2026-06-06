import { useState, useEffect, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import DoctorCard from "../../components/DoctorCard";
import DoctorFilterBar from "../../components/DoctorFilterBar";
import { getDoctors } from "../../services/doctorService";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { BsSliders } from "react-icons/bs";

function Doctors() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedSpeciality = params.get("speciality");

  const [filters, setFilters] = useState({
    specialization: "",
    rating: "",
    city: "",
    availability: false,
    experience: "",
    sort: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const doctorsPerPage = 12;

  useEffect(() => {
    if (selectedSpeciality) {
      setFilters((prev) => ({
        ...prev,
        specialization: selectedSpeciality,
      }));
    }
  }, [selectedSpeciality]);

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const filtered = doctors
      .filter((doc) =>
        filters.specialization
          ? doc.specialization === filters.specialization
          : true,
      )
      .filter((doc) =>
        filters.rating
          ? Number(doc.average_rating) >= Number(filters.rating)
          : true,
      )
      .filter((doc) => (filters.city ? doc.city === filters.city : true))
      .filter((doc) => (filters.availability ? doc.is_active !== false : true))
      .filter((doc) =>
        filters.experience
          ? Number(doc.experience) >= Number(filters.experience)
          : true,
      )
      .filter((doc) =>
        normalizedSearch
          ? doc.username.toLowerCase().includes(normalizedSearch)
          : true,
      );

    if (filters.sort === "nameAsc") {
      return [...filtered].sort((a, b) => a.username.localeCompare(b.username));
    }

    if (filters.sort === "nameDesc") {
      return [...filtered].sort((a, b) => b.username.localeCompare(a.username));
    }

    return filtered;
  }, [filters, searchText, doctors]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getDoctors();
        setDoctors(res.data);
        console.log("Doctors loaded:", res.data.length);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // You can add a toast or error state here
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

  const headingParts = [];

  if (filters.specialization) {
    headingParts.push(filters.specialization);
  }

  if (filters.city) {
    headingParts.push(`from ${filters.city}`);
  }

  if (filters.experience) {
    headingParts.push(`with ${filters.experience}+ years experience`);
  }

  if (filters.rating) {
    headingParts.push(`rated ${filters.rating}+`);
  }

  if (filters.availability) {
    headingParts.push("available now");
  }

  const heading = headingParts.length
    ? `All doctors ${headingParts.join(" ")}`
    : "All doctors";

  return (
    <MainLayout>
      <div className="bg-bgLight dark:bg-bgDark min-h-screen">
        <div className="md:hidden px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-borderLight dark:border-gray-700 bg-cardLight dark:bg-cardDark active:scale-95 transition"
            >
              <BsSliders size={18} />
            </button>

            <div className="flex-1">
              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </div>
          </div>

          <h2 className="text-base font-medium text-textLight dark:text-textDark">
            {heading}
          </h2>

          {loading ? (
            <p className="text-sm text-textLight dark:text-textDark">
              Loading doctors...
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayedDoctors.map((doctor) => (
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
          )}
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-[85%] max-w-sm h-full bg-bgLight dark:bg-bgDark px-3 py-4 overflow-y-auto animate-slideInLeft">
              <DoctorFilterBar
                filters={filters}
                setFilters={setFilters}
                doctors={doctors}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="mt-4 w-full py-2 rounded-lg bg-primary text-white"
              >
                Apply Filters
              </button>
            </div>

            <div className="flex-1" onClick={() => setShowFilters(false)} />
          </div>
        )}

        <div className="hidden md:flex max-w-8xl mx-auto px-20 py-8 gap-8">
          <DoctorFilterBar
            filters={filters}
            setFilters={setFilters}
            doctors={doctors}
          />

          <div className="flex-1 flex flex-col gap-4">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />

            <h2 className="text-xl font-medium text-textLight dark:text-textDark">
              {heading}
            </h2>

            {loading ? (
              <p className="text-sm text-textLight dark:text-textDark">
                Loading doctors...
              </p>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Doctors;
