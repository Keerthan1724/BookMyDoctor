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
    { label: "0+ years", value: 0 },
    { label: "5+ years", value: 5 },
    { label: "10+ years", value: 10 },
    { label: "15+ years", value: 15 },
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
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

  const cities = [...new Set(doctors.map((doc) => doc.city))];

  return (
    <div className="w-64 h-fit flex flex-col gap-6 bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark p-5 rounded-xl">
  {/* Clear */}
  <button
    onClick={clearFilters}
    className="border border-primary text-primary py-2 rounded hover:bg-primary hover:text-white transition"
  >
    All
  </button>

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* Sort */}
  <div>
    <p className="font-semibold mb-2 text-textLight dark:text-textDark">Sort</p>
    <select
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-textLight dark:text-textDark w-full p-2 rounded"
      onChange={(e) => handleChange("sort", e.target.value)}
    >
      <option value="">Default</option>
      <option value="nameAsc">Name A-Z</option>
      <option value="nameDesc">Name Z-A</option>
    </select>
  </div>

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* Available Only */}
  <div className="flex items-center justify-between">
    <p className="font-semibold text-textLight dark:text-textDark">Available Only</p>
    <input
      type="checkbox"
      onChange={(e) => handleChange("availability", e.target.checked)}
    />
  </div>

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* Specialization */}
  <div>
    <p className="font-semibold mb-2 text-textLight dark:text-textDark">Specialization</p>
    <div className="flex flex-col gap-2">
      {specializations.map((item) => (
        <button
          key={item}
          onClick={() => handleChange("specialization", item)}
          className={`border border-borderLight dark:border-borderDark rounded px-3 py-2 text-left transition
            ${
              filters.specialization === item
                ? "bg-primary text-white"
                : "hover:bg-primary/10 dark:hover:bg-primary/20 text-textLight dark:text-textDark"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* City */}
  <div>
    <p className="font-semibold mb-2 text-textLight dark:text-textDark">City</p>
    <select
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-textLight dark:text-textDark w-full p-2 rounded"
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

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* Experience */}
  <div>
    <p className="font-semibold mb-2 text-textLight dark:text-textDark">Year of Experience</p>
    <select
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-textLight dark:text-textDark w-full p-2 rounded"
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

  <hr className="border-t border-borderLight dark:border-borderDark my-2" />

  {/* Rating */}
  <div>
    <p className="font-semibold mb-2 text-textLight dark:text-textDark">Rating</p>
    <select
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-textLight dark:text-textDark w-full p-2 rounded"
      onChange={(e) => handleChange("rating", e.target.value)}
    >
      <option value="">Any Rating</option>
      {ratingOptions.map((rate) => (
        <option key={rate} value={rate}>
          {"⭐".repeat(rate)}
        </option>
      ))}
    </select>
  </div>
</div>
  );
}

export default DoctorFilterBar;
