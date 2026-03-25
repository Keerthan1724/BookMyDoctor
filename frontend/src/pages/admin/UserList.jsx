import AdminLayout from "../../layouts/AdminLayout";
import { adminSidebar } from "../../data/sidebarItems";

const UserList = () => {
  return (
    <AdminLayout sidebarItems={adminSidebar}>
      <h1 className="text-xl font-semibold p-4">UserList</h1>
    </AdminLayout>
  );
};

export default UserList;