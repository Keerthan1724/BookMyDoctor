import { FaEnvelope, FaPhone } from "react-icons/fa";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="relative dark:bg-cardDark bg-gray-50 dark:text-white">
      <div className="w-full flex bg-white dark:bg-gray-900 items-center justify-around py-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} className="h-12" alt="BookMyDoctor Logo" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            BookMyDoctor helps patients find trusted doctors <br/> and book appointments quickly and easily.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>
              <a href="/" className="hover:text-primary transition-colors">Home</a>
            </li>
            <li>
              <a href="/faqs" className="hover:text-primary transition-colors">FAQs</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Contact</h4>
          <div className="flex items-center gap-2 mb-2">
            <FaEnvelope className="text-gray-400" />
            <a href="mailto:bookmydoctor.app2026@gmail.com" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              bookmydoctor.app2026@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400" />
            <a href="tel:+919876543210" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              +91 9876543210
            </a>
          </div>
        </div>
      </div>

      <div className="border-t bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © 2026 BookMyDoctor. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;