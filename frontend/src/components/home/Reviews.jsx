import { testimonials } from "../../data/dummyData";
import { FaStar, FaRegStar } from "react-icons/fa";

function Reviews() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-semibold text-center mb-10">
        What Our Patients Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={item.image} className="w-12 h-12 rounded-full" />
              <p className="font-medium">{item.name}</p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {item.review}
            </p>

            <div className="flex">
              {[...Array(5)].map((_, i) =>
                i < item.rating ? (
                  <FaStar key={i} className="text-yellow-400" />
                ) : (
                  <FaRegStar key={i} className="text-gray-300 dark:text-gray-500" />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;