import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ReportCard from '../components/ReportCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Review Reports</h1>
              <p className="text-gray-500 mt-1">Manage and track environmental incidents reported by the community</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>
              <Button variant="primary" className="shadow-lg shadow-primary-500/30">
                Export Data
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <Card variant="glass" className="mb-8 p-1">
            <div className="flex flex-col md:flex-row gap-4 p-2">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search reports by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-gray-200 overflow-x-auto">
                {['all', 'pending', 'in progress', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${filterStatus === status
                        ? 'bg-white text-primary-700 shadow-md transform scale-105 font-bold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${filterStatus === status ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                      {statusCounts[status]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 animate-fade-in">
              {filteredReports.map((report, index) => (
                <div key={report.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slide-up">
                  <ReportCard report={report} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
