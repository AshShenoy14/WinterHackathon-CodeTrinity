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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Overview Cards */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.approvedProjects}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trees Planted</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.treesPlanted}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TreePine className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Heat Reduction</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.heatReduction.toFixed(1)}°C</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Thermometer className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
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
