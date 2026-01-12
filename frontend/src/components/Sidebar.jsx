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
    <aside className="w-64 bg-white/90 border-r border-gray-200 h-screen sticky top-0 shadow-xl backdrop-blur-md">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-md scale-[1.03]'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
              >
                {/* Animated active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r-lg animate-slide-in" />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-green-600' : 'text-gray-400 group-hover:text-green-600'}`} />
                <span className="z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
