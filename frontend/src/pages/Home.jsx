// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Users, TrendingUp, Shield,
  ArrowRight, CheckCircle, Clock, BarChart2, Search
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/layout/Container';
import MapView from '../components/MapView';

const mockReports = [
  { id: 1, title: 'Illegal Dumping', location: 'Central Park', type: 'waste', status: 'pending' },
  { id: 2, title: 'Deforestation', location: 'West Forest', type: 'trees', status: 'in-progress' },
  { id: 3, title: 'Water Pollution', location: 'Riverside', type: 'water', status: 'resolved' },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredReports = mockReports.filter(report =>
    (activeTab === 'all' || report.status === activeTab) &&
    (report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = [
    { value: '1,200+', label: 'Reports Submitted', icon: <BarChart2 className="w-6 h-6" /> },
    { value: '850+', label: 'Issues Resolved', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '95%', label: 'Satisfaction', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '24/7', label: 'Support', icon: <Clock className="w-6 h-6" /> }
  ];

  const features = [
    { icon: <MapPin className="w-6 h-6 text-white" />, title: 'Geo-Tagged Reports', description: 'Pinpoint environmental issues with precise location tracking', gradient: 'from-emerald-400 to-teal-500' },
    { icon: <Users className="w-6 h-6 text-white" />, title: 'Community Driven', description: 'Join thousands making a difference in their communities', gradient: 'from-blue-400 to-indigo-500' },
    { icon: <TrendingUp className="w-6 h-6 text-white" />, title: 'Real-time Updates', description: 'Track the progress of reported issues in real-time', gradient: 'from-amber-400 to-orange-500' },
    { icon: <Shield className="w-6 h-6 text-white" />, title: 'Verified Actions', description: 'Trust in our verification system for legitimate reports', gradient: 'from-rose-400 to-pink-500' }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[700px] flex items-center justify-center text-white pt-24 pb-20">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Green landscape"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <Container className="relative z-10 text-center">
          <h1 className="mb-8">
            Empowering Communities for a <span className="text-emerald-400">Greener Tomorrow</span>
          </h1>

          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Report, track, and resolve environmental issues in your area. Join the movement to make a real impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/report">
              <Button size="lg" className="btn-primary">
                Report an Issue <ArrowRight className="inline ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="glass" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Search */}
      <section className="-mt-16 px-4 relative z-20">
        <Container>
          <div className="glass-panel p-6 rounded-3xl shadow-soft-lg max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for issues..."
                  className="input-field pl-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {['all', 'pending', 'in-progress', 'resolved'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab ? 'bg-emerald-500 text-white shadow-glow' : 'bg-white/60 text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="py-24">
        <Container>
          <h2 className="text-center mb-12">Explore Environmental Issues</h2>
          <div className="card overflow-hidden">
            <MapView reports={filteredReports} />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-24">
        <Container>
          <h2 className="text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <Card key={i} className="card p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 bg-gradient-to-br ${f.gradient} flex items-center justify-center`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p>{f.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-20 text-center">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-emerald-600">{s.value}</div>
                <div className="text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;