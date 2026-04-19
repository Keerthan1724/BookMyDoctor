import Avatar from "./Avatar";

function DoctorCard({ doctor, onClick }) {
  const isAvailable = doctor.is_active !== false;

  return (
    <div
      className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      {/* IMAGE */}
      <div className="flex w-full h-28 sm:h-40 md:h-52 items-center justify-center bg-blue-200 hover:bg-blue-600">
        <Avatar
          name={doctor.username}
          image={doctor.profile_image || doctor.image}
          alt={doctor.username}
          className="h-full w-full rounded-none"
          imageClassName="object-contain"
          disableFallbackBackground
          textClassName="h-16 w-16 rounded-full bg-white/90 text-2xl font-semibold text-blue-600 shadow-sm flex items-center justify-center"
        />
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-3 md:p-4">
        
        <div
          className={`flex items-center gap-2 text-[10px] sm:text-xs font-medium ${
            isAvailable ? "text-green-500" : "text-red-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {isAvailable ? "Available" : "Not Available"}
        </div>

        <h3 className="mt-1 sm:mt-2 font-semibold text-sm sm:text-base md:text-lg text-textLight dark:text-textDark">
          {doctor.username}
        </h3>

        <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400">
          {doctor.specialization}
        </p>
      </div>
    </div>
  );
}

export default DoctorCard;
