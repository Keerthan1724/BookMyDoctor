import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

//   FAQ DATA

   export const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Browse doctors, select a doctor, choose available time, fill details and confirm booking.",
  },
  {
    q: "Do I need to pay before booking?",
    a: "You can choose offline or online payment. Online payment is enabled after doctor approval.",
  },
  {
    q: "Can I cancel my appointment?",
    a: "Yes, you can cancel an appointment before the scheduled time from your appointments page.",
  },
  {
    q: "When can I make online payment?",
    a: "Online payment is available only after doctor approves your appointment.",
  },
  {
    q: "Can I rate a doctor?",
    a: "Yes, rating is allowed only after completing the appointment.",
  },
];

//   CONTACT PAGE DATA

export const contactInfo = [
  {
    title: "Email",
    value: "bookmydoctor.app2026@gmail.com",
    icon: FiMail,
    isPrimary: true,
  },
  {
    title: "Phone",
    value: "+91 98765 43210",
    icon: FiPhone,
  },
  {
    title: "Location",
    value: "Karnataka, India",
    icon: FiMapPin,
  },
  {
    title: "Support",
    value: "Available 24/7 for your assistance",
  },
  {
    title: "Response Time",
    value: "Usually within a few hours",
  },
];

export const contactFormFields = [
  { label: "Name", name: "name", type: "text", placeholder: "Enter your name" },
  { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
  { label: "Message", name: "message", type: "textarea", placeholder: "Type your message" },
];

//   TERMS & CONDITIONS

export const termsData = [
  {
    title: "User Responsibility",
    desc: "Users must provide accurate details while booking appointments.",
  },
  {
    title: "Appointment Approval",
    desc: "All appointments are subject to doctor approval and not guaranteed instantly.",
  },
  {
    title: "Payments",
    desc: "Online payments are processed securely via Stripe or Razorpay.",
  },
  {
    title: "Cancellation",
    desc: "Appointments can be cancelled before scheduled time. Refund depends on payment method.",
  },
  {
    title: "Limitation of Liability",
    desc: "BookMyDoctor is not responsible for medical advice provided by doctors.",
  },
];

//   PRIVACY POLICY

export const privacyPolicyData = [
  {
    title: "Information We Collect",
    desc: "We collect basic details such as name, email, phone number, age and appointment information.",
  },
  {
    title: "How We Use Your Data",
    desc: "Your data is used to manage bookings, improve user experience and provide better services.",
  },
  {
    title: "Data Sharing",
    desc: "We do not sell your data. Information is only shared with doctors for appointment purposes.",
  },
  {
    title: "Data Security",
    desc: "We use secure systems to protect your data from unauthorized access.",
  },
  {
    title: "Your Rights",
    desc: "You can update or delete your account anytime from your profile settings.",
  },
];

//   ABOUT PAGE DATA

export const aboutFeatures = [
  {
    title: "Easy Appointment Booking",
    desc: "Browse doctors, check availability, and book appointments in just a few steps.",
  },
  {
    title: "Secure Payments",
    desc: "Supports both offline and online payments with secure integration.",
  },
  {
    title: "Smart Management",
    desc: "Manage appointments, track history, and view analytics easily.",
  },
];

export const howItWorks = [
  {
    step: "Find Doctor",
    desc: "Search and filter doctors based on specialization and availability.",
  },
  {
    step: "Book Appointment",
    desc: "Choose time slot, enter details, and confirm your appointment.",
  },
  {
    step: "Get Treated",
    desc: "Visit doctor and manage appointments easily from dashboard.",
  },
];

// FOOTER DATA

export const footerQuickLinks = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "About Us", href: "/about" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];