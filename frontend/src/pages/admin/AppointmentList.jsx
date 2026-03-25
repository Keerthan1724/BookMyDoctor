import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";

const AppointmentList = () => {
  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <h1 className="text-xl font-semibold p-4">AdppointmentList</h1>
    </AdminLayout>
  );
};

export default AppointmentList;