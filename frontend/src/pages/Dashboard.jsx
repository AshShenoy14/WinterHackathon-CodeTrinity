import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportsAPI, votingAPI } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  MapPin, 
  Users, 
  FileText, 
  Activity,
  ThumbsUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user, role } = useAuth();
  const [reports, setReports] = useState([]);
  const [votingSessions, setVotingSessions] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    approvedReports: 0,
    userReports: 0,
    userVotes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const reportsResponse = await reportsAPI.getAll({ limit: 10 });
      setReports(reportsResponse.reports);

      if (['expert', 'authority'].includes(role)) {
        const votingResponse = await votingAPI.getSessions({ limit: 5 });
        setVotingSessions(votingResponse.sessions);
      }

      const totalReports = reportsResponse.reports.length;
      const pendingReports = reportsResponse.reports.filter(r => r.status === 'pending').length;
      const approvedReports = reportsResponse.reports.filter(r => r.status === 'approved').length;

      setStats({
        totalReports,
        pendingReports,
        approvedReports,
        userReports: user?.reportsCount || 0,
        userVotes: user?.votesCount || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteOnReport = async (reportId, voteType) => {
    try {
      await reportsAPI.vote(reportId, voteType);
      loadDashboardData();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: CheckCircle
    };
    return icons[status] || Clock;
  };

  const reportTypeData = [
    { name: 'Unused Space', value: reports.filter(r => r.reportType === 'unused_space').length, color: '#10b981' },
    { name: 'Tree Loss', value: reports.filter(r => r.reportType === 'tree_loss').length, color: '#ef4444' },
    { name: 'Heat Hotspot', value: reports.filter(r => r.reportType === 'heat_hotspot').length, color: '#f59e0b' }
  ];

  const statusData = [
    { name: 'Pending', value: stats.pendingReports, color: '#f59e0b' },
    { name: 'Approved', value: stats.approvedReports, color: '#10b981' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="bg-white/80 backdrop-blur-xl border-b border-secondary-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/report'}>
              New Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card hover={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card hover={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.userReports}</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Card>

          <Card hover={false} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.userVotes}</p>
              </div>
              <div className="p-3 bg-accent-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card hover={false} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {reports.slice(0, 5).map((report) => {
              const StatusIcon = getStatusIcon(report.status);
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <Badge variant={getStatusColor(report.status)} size="sm">
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{report.location.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="w-4 h-4" />
                          <span>{new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <span>{report.upvotes || 0}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleVoteOnReport(report.id, 'upvote')}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {['expert', 'authority'].includes(role) && votingSessions.length > 0 && (
          <Card hover={false} className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Voting Sessions</h3>
            <div className="space-y-4">
              {votingSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{session.title}</h4>
                    <Badge variant={session.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {session.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{session.totalVotes} votes</span>
                      <span>Ends: {new Date(session.endDate?.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;