function DoctorCard({ doctor, onClick }) {
  return (
    <div
      className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-blue-200 hover:bg-blue-600">
        <img
          src={doctor.profile_image || "/default-doctor.png"}
          alt={doctor.username}
          className="w-full h-52 object-contain"
        />
      </div>

      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            doctor.is_active === false
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              !doctor.is_active ? "bg-red-500" : "bg-green-500"
            }`}
          ></span>
          {doctor.is_active === false ? "Not Available" : "Available"}
        </div>

        <h3 className="mt-2 font-semibold text-lg text-textLight dark:text-textDark">
          {doctor.username}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {doctor.specialization}
        </p>
      </div>
    </div>
  );
}

export default DoctorCard;