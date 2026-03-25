import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export const contactInfo = [
  { title: "Email", value: "bookmydoctor.app2026@gmail.com", isPrimary: true, icon: FiMail },
  { title: "Phone", value: "+91 98765 43210", icon: FiPhone },
  { title: "Location", value: "Karnataka, India", icon: FiMapPin },
  { title: "Support", value: "Available 24/7 for your assistance" },
  { title: "Response Time", value: "Usually within a few hours" },
];

export const formFields = [
  { label: "Name", name: "name", type: "text", placeholder: "Enter your name" },
  { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
];