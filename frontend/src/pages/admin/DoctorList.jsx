import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";

const DoctorList = () => {
  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <h1 className="text-xl font-semibold p-4">DoctorList</h1>
    </AdminLayout>
  );
};

export default DoctorList;