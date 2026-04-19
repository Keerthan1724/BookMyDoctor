import {
  FaStethoscope,
  FaFemale,
  FaBone,
  FaBrain,
  FaBaby,
  FaHeartbeat,
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaStar,
} from "react-icons/fa";
import { MdHearing } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";

export const specialities = [
  { name: "General Physician", icon: FaStethoscope },
  { name: "Gynecologist", icon: FaFemale },
  { name: "Dermatologist", icon: GiMedicines },
  { name: "Cardiologist", icon: FaHeartbeat },
  { name: "Orthopedic", icon: FaBone },
  { name: "Pediatrician", icon: FaBaby },
  { name: "Neurologist", icon: FaBrain },
  { name: "ENT Specialist", icon: MdHearing },
];

export const testimonials = [
  {
    name: "Rohan Mehta",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    review:
      "Booking an appointment was extremely easy. The doctors are very professional and helpful.",
    rating: 5,
  },
  {
    name: "Ananya Shetty",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    review:
      "Amazing platform. I could find a specialist quickly and the booking process was smooth.",
    rating: 4,
  },
  {
    name: "Karthik Rao",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    review:
      "Very convenient and user friendly. Highly recommended for quick doctor consultations.",
    rating: 5,
  },
];

export const appStats = [
  { Icon: FaUsers, value: "5k+", label: "Active Clients" },
  { Icon: FaUserMd, value: "1k+", label: "Doctors" },
  { Icon: FaCalendarCheck, value: "10k+", label: "Appointments Completed" },
  { Icon: FaStar, value: "4.8 / 5", label: "Avg Rating" },
];
