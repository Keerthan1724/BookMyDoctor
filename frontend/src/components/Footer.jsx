import { FaEnvelope, FaPhone } from "react-icons/fa";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 transition-colors duration-300">
      
      <div className="max-w-full mx-auto px-4 sm:px-5 md:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 lg:px-40">
        
        {/* LOGO + DESC */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <img src={logo} className="h-12" alt="BookMyDoctor Logo" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            BookMyDoctor helps patients find trusted doctors and book
            appointments quickly and easily.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">
            Quick Links
          </h4>

          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
            <li><a href="/" className="hover:text-primary transition">Home</a></li>
            <li><a href="/doctors" className="hover:text-primary transition">Doctors</a></li>
            <li><a href="/about" className="hover:text-primary transition">About Us</a></li>
            <li><a href="/faqs" className="hover:text-primary transition">FAQs</a></li>
            <li><a href="/contact" className="hover:text-primary transition">Contact</a></li>
            <li><a href="/privacy" className="hover:text-primary transition">Privacy</a></li>
            <li><a href="/terms" className="hover:text-primary transition">Terms</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">
            Contact
          </h4>

          <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaEnvelope className="text-gray-400" />
            <a
              href="mailto:bookmydoctor.app2026@gmail.com"
              className="hover:text-primary transition"
            >
              bookmydoctor.app2026@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaPhone className="text-gray-400" />
            <a
              href="tel:+919876543210"
              className="hover:text-primary transition"
            >
              +91 9876543210
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © 2026 BookMyDoctor. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;