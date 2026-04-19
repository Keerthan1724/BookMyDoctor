function DoctorFilterBar({ filters, setFilters, doctors }) {
  const specializations = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Cardiologist",
    "Orthopedic",
    "ENT Specialist",
  ];

  const experienceOptions = [
    { label: "0+", value: 0 },
    { label: "5+", value: 5 },
    { label: "10+", value: 10 },
    { label: "15+", value: 15 },
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "availability"
          ? value
          : prev[key] === value
            ? ""
            : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialization: "",
      rating: "",
      city: "",
      availability: false,
      experience: "",
      sort: "",
    });
  };

  const cities = [...new Set(doctors.map((doc) => doc.city).filter(Boolean))].sort();

  return (
    <div className="w-64 h-fit flex flex-col gap-6 bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark p-5">
      <button
        onClick={clearFilters}
        className="border border-primary text-primary py-2 hover:bg-primary hover:text-white transition"
      >
        Clear Filters
      </button>

      <hr className="border-t border-borderLight dark:border-borderDark" />

      <div>
        <p className="font-semibold mb-2 text-textLight dark:text-textDark">Sort</p>
        <select
          className="w-full p-2 border bg-cardLight dark:bg-cardDark"
          value={filters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option value="">Default</option>
          <option value="nameAsc">Name A-Z</option>
          <option value="nameDesc">Name Z-A</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold text-textLight dark:text-textDark">
          Available Only
        </p>
        <input
          type="checkbox"
          checked={filters.availability}
          onChange={(e) => handleChange("availability", e.target.checked)}
        />
      </div>

      <div>
        <p className="font-semibold mb-2 text-textLight dark:text-textDark">
          Specialization
        </p>
        <div className="flex flex-col gap-2">
          {specializations.map((item) => (
            <button
              key={item}
              onClick={() => handleChange("specialization", item)}
              className={`border px-3 py-2 text-left ${
                filters.specialization === item
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2 text-textLight dark:text-textDark">
          City
        </p>
        <select
          className="w-full p-2 border bg-cardLight dark:bg-cardDark"
          value={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
        >
          <option value="">Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2 text-textLight dark:text-textDark">
          Experience
        </p>
        <select
          className="w-full p-2 border bg-cardLight dark:bg-cardDark"
          value={filters.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
        >
          <option value="">Any</option>
          {experienceOptions.map((exp) => (
            <option key={exp.value} value={exp.value}>
              {exp.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2 text-textLight dark:text-textDark">
          Rating
        </p>
        <select
          className="w-full p-2 border bg-cardLight dark:bg-cardDark"
          value={filters.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
        >
          <option value="">Any</option>
          {ratingOptions.map((rate) => (
            <option key={rate} value={rate}>
              {`${rate} Star${rate > 1 ? "s" : ""}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DoctorFilterBar;
