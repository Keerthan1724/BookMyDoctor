import {
  CalendarDays,
  Wallet,
  Clock,
  CheckCircle2,
  Stethoscope,
  Users,
} from "lucide-react";

export const doctorDashboardItems = [
  {
    label: "Total Earnings",
    value: "totalEarnings",
    icon: Wallet,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Active Appt.",
    value: "activeAppointments",
    icon: Clock,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Completed Appt.",
    value: "completedAppointments",
    icon: CheckCircle2,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export const userDashboardItems = [
  {
    label: "Total Bookings",
    value: "totalBookings",
    icon: CalendarDays,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Total Spent",
    value: "totalSpent",
    icon: Wallet,
    iconBg: "bg-gray-200",
    iconColor: "text-gray-700",
  },
  {
    label: "Upcoming",
    value: "upcoming",
    icon: Clock,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Completed",
    value: "completed",
    icon: CheckCircle2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export const adminDashboardItems = [
  {
    label: "Total Users",
    value: "totalUsers",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Total Doctors",
    value: "totalDoctors",
    icon: Stethoscope,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "Appointments",
    value: "totalAppointments",
    icon: CalendarDays,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    label: "Total Revenue",
    value: "totalRevenue",
    icon: Wallet,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];
