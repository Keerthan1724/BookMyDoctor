import { specialities } from "../../data/homeData";
import { useNavigate } from "react-router-dom";

function SpecialityFilter() {
  const navigate = useNavigate();

  const handleClick = (speciality) => {
    navigate(`/doctors?speciality=${encodeURIComponent(speciality)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-slate-800 dark:text-white">
        Find by Speciality
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {specialities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              onClick={() => handleClick(item.name)}
              className="cursor-pointer rounded-2xl px-4 py-6 sm:py-8 text-center
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="flex justify-center mb-3 text-primary text-3xl sm:text-4xl">
                <Icon />
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SpecialityFilter;
