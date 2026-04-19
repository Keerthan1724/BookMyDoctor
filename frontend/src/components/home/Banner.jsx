import { Link } from "react-router-dom";
import doc1 from "../../assets/doc1.png";
import doc2 from "../../assets/doc2.png";
import doc3 from "../../assets/doc3.png";

function Banner() {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[75vh] md:min-h-[85vh] flex items-center">
        <div className="grid md:grid-cols-2 items-center gap-10 md:gap-16 w-full">
          
          {/* LEFT */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-gray-800 dark:text-white leading-tight">
              Book Appointment With <br /> Trusted Doctors
            </h1>

            <div className="w-full h-[2px] my-6 md:my-8 bg-slate-300 dark:bg-gray-400"></div>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
              Simply browse through our extensive list of trusted doctors and
              schedule your appointment hassle-free.
            </p>

            <Link to="/doctors">
              <button className="mt-8 bg-green-600 hover:bg-orange-600 text-white font-medium px-12 py-4 w-full rounded-xl shadow-md transition">
                Find Doctors
              </button>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center md:justify-end">
            <div className="flex items-end gap-2 sm:gap-3">
              
              <div className="w-24 sm:w-32 md:w-36 h-40 sm:h-52 md:h-60 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-200">
                <img src={doc1} className="w-full h-full object-cover" />
              </div>

              <div className="w-28 sm:w-36 md:w-40 h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden shadow-lg -mb-4 sm:-mb-6 bg-white dark:bg-gray-200">
                <img src={doc2} className="w-full h-full object-cover" />
              </div>

              <div className="w-24 sm:w-32 md:w-36 h-40 sm:h-52 md:h-60 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-200">
                <img src={doc3} className="w-full h-full object-cover" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Banner;