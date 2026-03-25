import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";

const AdminDashboard = () => {
  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <h1 className="text-xl font-semibold p-4">Admin Dashboard</h1>
    </AdminLayout>
  );
};

export default AdminDashboard;