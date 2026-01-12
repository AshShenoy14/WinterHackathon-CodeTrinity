import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/report', label: 'Report' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-green-700 transition-colors">GreenPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-2 py-1 text-base font-medium transition-colors duration-200
                  ${location.pathname === link.to
                    ? 'text-green-700 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-green-500 after:rounded-full'
                    : 'text-gray-700 hover:text-green-600'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/profile"
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors shadow-sm"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-down bg-white/95 backdrop-blur-xl rounded-b-xl shadow-xl">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200
                    ${location.pathname === link.to
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                className="px-3 py-2 rounded-lg font-medium flex items-center gap-2 text-gray-700 hover:bg-green-50 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" /> Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
// ...existing code...
