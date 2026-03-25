import AdminNavbar from "../components/AdminNavbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children, sidebarItems }) => {
  return (
    <div className="bg-bgLight dark:bg-cardDark min-h-screen">
      <AdminNavbar />

      <div className="flex">
        <div className="flex-shrink-0">
          <Sidebar items={sidebarItems} />
        </div>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
