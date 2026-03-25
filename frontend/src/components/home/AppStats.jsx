import { FaUsers, FaUserMd, FaCalendarCheck, FaStar } from "react-icons/fa";

function AppStats() {
  const stats = [
    { Icon: FaUsers, value: "5k+", label: "Active Clients" },
    { Icon: FaUserMd, value: "1k+", label: "Doctors" },
    { Icon: FaCalendarCheck, value: "10k+", label: "Appointments Completed" },
    { Icon: FaStar, value: "4.8 / 5", label: "Avg Rating" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <stat.Icon className="text-gray-600 dark:text-gray-400 text-2xl mb-2" />
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AppStats;