import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <Topbar />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;