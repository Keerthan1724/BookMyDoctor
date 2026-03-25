import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  User2,
  UserCircle
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
    icon: Users,
  },
  {
    name: "Users List",
    path: "/admin/userlist",
    icon: User2,
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