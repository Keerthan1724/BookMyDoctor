import { FaEnvelope, FaPhone } from "react-icons/fa";
import logo from "../assets/logo.png";
import {
  footerQuickLinks,
  contactInfo,
} from "../data/publicData";

function Footer() {
  const email = contactInfo.find((item) => item.title === "Email")?.value;
  const phone = contactInfo.find((item) => item.title === "Phone")?.value;

  return (
    <footer className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-5 md:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 lg:px-40">
        
        {/* LOGO + DESC */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-3 select-none">
              <img
                src={logo}
                className="h-11 w-11 object-contain"
                alt="BookMyDoctor"
              />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
                <span className="text-slate-900 dark:text-slate-100">Book</span>
                <span className="text-teal-600 font-bold">My</span>
                <span className="text-blue-600 font-bold">Doctor</span>
              </h1>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            BookMyDoctor helps patients find trusted doctors and book appointments quickly and easily.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">
            Quick Links
          </h4>

          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
            {footerQuickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:text-primary transition">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">
            Contact
          </h4>

          <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaEnvelope className="text-gray-400" />
            <a href={`mailto:${email}`} className="hover:text-primary transition">
              {email}
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaPhone className="text-gray-400" />
            <a href={`tel:${phone}`} className="hover:text-primary transition">
              {phone}
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