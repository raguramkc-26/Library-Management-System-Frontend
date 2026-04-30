import Sidebar from "../components/layouts/Sidebar";
import Topbar from "../components /layouts/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        
        <Topbar />

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;