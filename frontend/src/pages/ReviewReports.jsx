import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReportCard from '../components/ReportCard';
import { Filter, Search } from 'lucide-react';

export default function ReviewReports() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allReports = [
    {
      id: 1,
      title: 'Illegal Waste Dumping',
      description: 'Large amounts of construction waste dumped near residential area causing health hazards',
      location: 'Downtown District',
      status: 'Pending',
      date: 'Jan 10, 2026',
      image: 'https://images.unsplash.com/photo-1758599668360-48ba8ba71b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 2,
      title: 'Air Quality Alert',
      description: 'Unusual smoke emissions from nearby factory affecting air quality',
      location: 'Industrial Zone',
      status: 'In Progress',
      date: 'Jan 9, 2026',
      image: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 3,
      title: 'Water Contamination',
      description: 'Discolored water in local stream, possible chemical contamination',
      location: 'Park Avenue',
      status: 'Resolved',
      date: 'Jan 8, 2026',
      image: 'https://images.unsplash.com/photo-1583224964836-b3670d6b9185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 4,
      title: 'Deforestation Activity',
      description: 'Unauthorized tree cutting in protected forest area',
      location: 'Green Valley',
      status: 'Pending',
      date: 'Jan 7, 2026',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 5,
      title: 'Plastic Waste on Beach',
      description: 'Large accumulation of plastic waste affecting marine ecosystem',
      location: 'Coastal Beach',
      status: 'In Progress',
      date: 'Jan 6, 2026',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
    {
      id: 6,
      title: 'Oil Spill Incident',
      description: 'Small oil spill near harbor area requiring immediate attention',
      location: 'Harbor District',
      status: 'Resolved',
      date: 'Jan 5, 2026',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    },
  ];

  const filteredReports = allReports.filter((report) => {
    const matchesStatus = filterStatus === 'all' || report.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: allReports.length,
    pending: allReports.filter((r) => r.status === 'Pending').length,
    'in progress': allReports.filter((r) => r.status === 'In Progress').length,
    resolved: allReports.filter((r) => r.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Reports</h1>

            {/* Search and Filter Bar */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 rounded-lg shadow-lg border border-emerald-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search reports by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 input-field focus:ring-cyan-400 focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-cyan-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 input-field focus:ring-cyan-400 focus:border-cyan-400 outline-none"
                  >
                    <option value="all">All Status ({statusCounts.all})</option>
                    <option value="pending">Pending ({statusCounts.pending})</option>
                    <option value="in progress">In Progress ({statusCounts['in progress']})</option>
                    <option value="resolved">Resolved ({statusCounts.resolved})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['all', 'pending', 'in progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all duration-150 shadow-sm border-2 ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 text-white border-cyan-400 scale-105'
                      : 'bg-white text-gray-700 border-emerald-100 hover:bg-emerald-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>

          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gradient-to-br from-white via-green-50 to-cyan-50 p-4 rounded-xl">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white via-green-50 to-cyan-50 rounded-lg shadow-lg border border-emerald-100 p-12 text-center">
              <p className="text-gray-500">No reports found matching your criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
