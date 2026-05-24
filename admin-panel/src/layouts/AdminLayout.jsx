import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ShieldCheck, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/workers", label: "Workers", icon: Users },
    { to: "/schemes", label: "Schemes", icon: ShieldCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-[#f3f6fb]">
      <aside className="w-72 bg-[#0f172a] text-white p-6 fixed left-0 top-0 bottom-0">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tight">Arogya Sahayak</h1>
          <p className="text-slate-400 text-sm">Admin Control Panel</p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="text-lg font-bold text-slate-800">
              {admin?.name || "Admin"}
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;