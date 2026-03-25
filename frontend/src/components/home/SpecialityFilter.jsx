import { specialities } from "../../data/dummyData";

function SpecialityFilter() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-10 dark:text-white text-gray-800">
        Find by Speciality
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {specialities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-12 text-center hover:shadow-xl cursor-pointer transition"
            >
              <div className="flex justify-center mb-4 text-blue-600 dark:text-white text-5xl">
                <Icon />
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-200">{item.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SpecialityFilter;