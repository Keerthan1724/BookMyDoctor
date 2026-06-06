import { testimonials } from "../../data/homeData";
import { FaStar, FaRegStar } from "react-icons/fa";

function Reviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-10 text-gray-800 dark:text-white">
        What Our Patients Say
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.image}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
              />
              <p className="font-medium text-sm sm:text-base">{item.name}</p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">
              {item.review}
            </p>

            <div className="flex">
              {[...Array(5)].map((_, i) =>
                i < item.rating ? (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ) : (
                  <FaRegStar
                    key={i}
                    className="text-gray-300 dark:text-gray-500 text-sm"
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
