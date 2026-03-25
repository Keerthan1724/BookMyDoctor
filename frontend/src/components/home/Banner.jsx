import { Link } from "react-router-dom";
import doc1 from "../../assets/doc1.png";
import doc2 from "../../assets/doc2.png";
import doc3 from "../../assets/doc3.png";

function Banner() {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-6 min-h-[85vh] flex items-center">
        <div className="grid md:grid-cols-2 items-center gap-16 w-full">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold text-gray-800 dark:text-white leading-tight">
              Book Appointment With <br /> Trusted Doctors
            </h1>

            <div className="w-full h-[2px] my-8 dark:bg-gray-400 bg-slate-300"></div>

            <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg max-w-lg">
              Simply browse through our extensive list of trusted doctors and
              schedule your appointment hassle-free.
            </p>

            <Link to="/doctors">
              <button className="mt-8 bg-green-600 hover:bg-orange-600 text-white font-medium px-12 py-4 w-full rounded-xl shadow-md transition">
                Find Doctors
              </button>
            </Link>
          </div>

          <div className="flex justify-center md:justify-end items-end">
            <div className="flex items-end">
              <div className="w-36 h-60 bg-white dark:bg-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-400">
                <img
                  src={doc1}
                  alt="doctor"
                  className="w-40 h-60 object-cover rounded-xl shadow-lg z-10"
                />
              </div>

              <div className="w-40 h-72 bg-white dark:bg-gray-200 rounded-xl shadow-lg flex items-center justify-center text-gray-400 mx-1 -mb-6 z-10">
                <img
                  src={doc2}
                  alt="doctor"
                  className="w-40 h-72 object-cover rounded-xl shadow-lg z-10"
                />
              </div>

              <div className="w-36 h-60 bg-white dark:bg-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-400">
                <img
                  src={doc3}
                  alt="doctor"
                  className="w-40 h-60 object-cover rounded-xl shadow-lg z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
