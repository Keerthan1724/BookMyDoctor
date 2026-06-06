import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  UserCircle,
  Stethoscope
} from "lucide-react";

export const adminSidebar = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  }, 
  {
    name: "Add Doctor",
    path: "/admin/adddoctor",
    icon: UserPlus,
  },
  {
    name: "Appointments List",
    path: "/admin/appointmentlist",
    icon: CalendarDays,
  },
  {
    name: "Doctors List",
    path: "/admin/doctorlist",
    icon: Stethoscope,
  },
  {
    name: "Users List",
    path: "/admin/userlist",
    icon: Users,
  },
];

export const doctorSidebar = [
  {
    name: "Dashboard",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    path: "/doctor/profile",
    icon: UserCircle,
  },
  {
    name: "Appointments",
    path: "/doctor/appointment",
    icon: CalendarDays,
  },
];