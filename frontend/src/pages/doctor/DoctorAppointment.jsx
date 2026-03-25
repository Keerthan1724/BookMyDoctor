import AdminLayout from "../../layouts/AdminLayout";
import { doctorSidebar } from "../../data/sidebarItems";

const DoctorAppointment = () => {
  return (
    <AdminLayout sidebarItems={doctorSidebar}>
      <div>Appointments</div>
    </AdminLayout>
  );
};

export default DoctorAppointment;
