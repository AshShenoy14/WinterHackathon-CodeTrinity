import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Reports', value: '156', icon: AlertTriangle, color: 'blue' },
    { label: 'Active Issues', value: '42', icon: Clock, color: 'yellow' },
    { label: 'Resolved', value: '98', icon: CheckCircle, color: 'green' },
    { label: 'Impact Score', value: '847', icon: TrendingUp, color: 'purple' },
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Illegal Waste Dumping',
      description: 'Large amounts of construction waste dumped near residential area',
      location: 'Downtown District',
      status: 'Pending',
      date: 'Jan 10, 2026',
      image: 'https://images.unsplash.com/photo-1758599668360-48ba8ba71b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 2,
      title: 'Air Quality Alert',
      description: 'Unusual smoke emissions from nearby factory',
      location: 'Industrial Zone',
      status: 'In Progress',
      date: 'Jan 9, 2026',
      image: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 3,
      title: 'Water Contamination',
      description: 'Discolored water in local stream',
      location: 'Park Avenue',
      status: 'Resolved',
      date: 'Jan 8, 2026',
      image: 'https://images.unsplash.com/photo-1583224964836-b3670d6b9185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Overview Cards */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const colorGradients = {
                  blue: 'from-blue-100 via-blue-200 to-cyan-100',
                  yellow: 'from-yellow-100 via-yellow-200 to-orange-100',
                  green: 'from-green-100 via-emerald-100 to-lime-100',
                  purple: 'from-purple-100 via-pink-100 to-rose-100',
                };
                return (
                  <div
                    key={stat.label}
                    className={`rounded-xl shadow-lg border-2 p-6 bg-gradient-to-br ${colorGradients[stat.color] || 'from-gray-100 to-gray-50'} border-${stat.color}-200`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center bg-white/70 shadow ${getColorClasses(stat.color)}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-700 font-semibold">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Preview */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Map</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <MapView reports={recentReports} />
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
