import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  Users, 
  TreePine, 
  TrendingUp, 
  Thermometer,
  MapPin,
  BarChart3,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapView from '../components/MapView';
import ReportCard from '../components/ReportCard';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    approvedProjects: 0,
    treesPlanted: 0,
    heatReduction: 0,
    totalUpvotes: 0,
    activeUsers: 0
  });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [reportTypeData, setReportTypeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsData);
      calculateStats(reportsData);
      prepareChartData(reportsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const calculateStats = (reportsData) => {
    const totalReports = reportsData.length;
    const approvedProjects = reportsData.filter(r => r.status === 'approved').length;
    const totalUpvotes = reportsData.reduce((sum, r) => sum + (r.upvotes || 0), 0);
    
    // Mock calculations for demonstration
    const treesPlanted = approvedProjects * 15; // Average 15 trees per project
    const heatReduction = approvedProjects * 0.8; // Average 0.8°C reduction per project
    const activeUsers = new Set(reportsData.map(r => r.userId)).size;

    setStats({
      totalReports,
      approvedProjects,
      treesPlanted,
      heatReduction,
      totalUpvotes,
      activeUsers
    });
  };

  const prepareChartData = (reportsData) => {
    // Time series data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayReports = reportsData.filter(report => {
        const reportDate = report.createdAt?.toDate();
        return reportDate >= date && reportDate < nextDate;
      });
      
      last7Days.push({
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        reports: dayReports.length,
        upvotes: dayReports.reduce((sum, r) => sum + (r.upvotes || 0), 0)
      });
    }
    setTimeSeriesData(last7Days);

    // Report type distribution
    const typeCounts = reportsData.reduce((acc, report) => {
      const type = report.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCounts).map(([type, count]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: type === 'vacant_land' ? '#f97316' : 
             type === 'tree_loss' ? '#dc2626' : 
             type === 'heat_hotspot' ? '#ef4444' : '#6b7280'
    }));
    setReportTypeData(typeData);
  };

  const recentReports = reports.slice(0, 5);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Overview Cards */}
          <div className="mb-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-secondary-900 mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-secondary-600">Monitor your urban greening impact in real-time</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Reports"
                value={stats.totalReports}
                change="+12% from last month"
                changeType="positive"
                icon={MapPin}
                color="primary"
                trend="This month"
                animated={true}
              />

              <StatsCard
                title="Approved Projects"
                value={stats.approvedProjects}
                change="+8% from last month"
                changeType="positive"
                icon={CheckCircle}
                color="success"
                trend="This month"
                animated={true}
                className="animation-delay-100"
              />

              <StatsCard
                title="Trees Planted"
                value={stats.treesPlanted}
                change="+25% from last month"
                changeType="positive"
                icon={TreePine}
                color="success"
                trend="This month"
                animated={true}
                className="animation-delay-200"
              />

              <StatsCard
                title="Heat Reduction"
                value={`${stats.heatReduction.toFixed(1)}°C`}
                change="+0.3°C from last month"
                changeType="positive"
                icon={Thermometer}
                color="error"
                trend="This month"
                animated={true}
                className="animation-delay-300"
              />
            </div>
          </div>

          {/* Map Preview */}
          <div className="mb-6">
            <Card hover={true} animated={true} className="overflow-hidden">
              <div className="p-6 border-b border-secondary-200/60">
                <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Issue Map
                </h2>
                <p className="text-sm text-secondary-600 mt-1">Real-time visualization of reported issues</p>
              </div>
              <div className="p-4">
                <MapView reports={recentReports} />
              </div>
            </Card>
          </div>

          {/* Recent Reports */}
          <div>
            <Card hover={true} animated={true} className="overflow-hidden">
              <div className="p-6 border-b border-secondary-200/60">
                <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Recent Reports
                </h2>
                <p className="text-sm text-secondary-600 mt-1">Latest community submissions</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentReports.map((report) => (
                    <div key={report.id} className="animate-fade-in animation-delay-100">
                      <ReportCard report={report} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
