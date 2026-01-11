import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, User } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/report', label: 'Report Issue', icon: FileText },
    { path: '/review', label: 'Review Reports', icon: CheckSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
