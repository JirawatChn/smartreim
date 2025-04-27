import { Link } from "react-router-dom";

interface SidebarProps {
  role: number | undefined;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const getRoleText = (role: number) => {
    switch (role) {
      case 1:
        return "User";
      case 2:
        return "Admin";
      default:
        return "Guest";
    }
  };

  const roleColor = {
    Guest: "bg-gray-200 text-gray-700",
    User: "bg-blue-100 text-blue-700",
    Admin: "bg-red-100 text-red-700",
  };

  const roleText = getRoleText(role ?? 0);

  return (
    <aside className="sidebar h-screen overflow-y-auto flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center px-2 mt-4">
          <div className="sidebar-header">
            <div className="flex items-center gap-2">
              <span className="sidebar-title">Smart Reim</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${roleColor[roleText]}`}
              >
                {roleText}
              </span>
            </div>
            <span>ระบบเบิกเงินค่าอบรม</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {(role === 0 || role === 1) && (
            <>
              <Link to="/user/dashboard" className="menu-item">
                <span className="bold">Dashboard</span>
              </Link>
              <Link to="/user/send" className="menu-item">
                <span className="bold">Send Request</span>
              </Link>
              <Link to="/user/requests" className="menu-item">
                <span className="bold">My Requests</span>
              </Link>
            </>
          )}

          {role === 2 && (
            <>
              <Link to="/admin/dashboard" className="menu-item">
                <span className="bold">Dashboard</span>
              </Link>
              <Link to="/admin/requests" className="menu-item">
                <span className="bold">Request</span>
              </Link>
            </>
          )}
          {role !== undefined && (
            <Link to="/set-roles" className="menu-item flex">
              <span className="bold">Set Roles</span>
              <span className="text-xs text-gray-500">(Demo Only)</span>
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};
