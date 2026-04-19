import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children, sidebarItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <AdminNavbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex items-stretch min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          items={sidebarItems}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;