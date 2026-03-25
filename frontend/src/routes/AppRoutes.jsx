import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/public/Home";
import Doctors from "../pages/public/Doctors";
import DoctorDetails from "../pages/public/DoctorDetails";
import Contact from "../pages/public/Contact";
import FAQs from "../pages/public/FAQs";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import TnC from "../pages/public/TnC";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OTPVerify from "../pages/auth/OTPVerify";
import ResetPassword from "../pages/auth/ResetPassword";

import UserProfile from "../pages/user/UserProfile";
import Appointment from "../pages/user/Appointment";
import AppointmentHistory from "../pages/user/AppointmentHistory";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AddDoctor from "../pages/admin/AddDoctor";
import AppointmentList from "../pages/admin/AppointmentList";
import DoctorList from "../pages/admin/DoctorList";
import UserList from "../pages/admin/UserList";

import DoctorAppointment from "../pages/doctor/DoctorAppointment";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfile from "../pages/doctor/DoctorProfile";

function AppRoutes() {
  const location = useLocation();

  const background = location.state?.background || null;

  return (
    <>
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <PublicRoute>
              <Doctors />
            </PublicRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />

        <Route
          path="/faqs"
          element={
            <PublicRoute>
              <FAQs />
            </PublicRoute>
          }
        />

        <Route
          path="/privacy"
          element={
            <PublicRoute>
              <PrivacyPolicy />
            </PublicRoute>
          }
        />

        <Route
          path="/terms"
          element={
            <PublicRoute>
              <TnC />
            </PublicRoute>
          }
        />

        <Route
          path="/doctordetails/:id"
          element={
            <PublicRoute>
              <DoctorDetails />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointmenthistory"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/adddoctor"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AddDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointmentlist"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AppointmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctorlist"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/userlist"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointment"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
