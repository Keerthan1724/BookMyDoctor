import { appStats } from "../../data/homeData";

function AppStats() {
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
        {appStats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <stat.Icon className="text-gray-600 dark:text-gray-400 text-xl sm:text-2xl mb-2" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AppStats;
