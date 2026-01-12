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

// Mock data for demonstration
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title: 'Geo-Tagged Reports',
      description: 'Pinpoint environmental issues with precise location tracking',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Community Driven',
      description: 'Join thousands making a difference in their communities',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: 'Real-time Updates',
      description: 'Track the progress of reported issues in real-time',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: 'Verified Actions',
      description: 'Trust in our verification system for legitimate reports',
      gradient: 'from-rose-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[700px] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white pt-24 pb-20">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Green landscape"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide">Winter Hackathon 2024</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight animate-slide-up">
              Empowering Communities for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-secondary-300">Greener Tomorrow</span>
            </h1>

            <p className="text-xl md:text-2xl font-light mb-10 text-primary-50 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Report, track, and resolve environmental issues in your area. Join the movement to make a real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/report">
                <Button size="lg" className="rounded-full px-8 py-4 text-lg font-semibold shadow-xl hover:scale-105 transition-transform duration-300">
                  Report an Issue <ArrowRight className="inline ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="glass" size="lg" className="rounded-full px-8 py-4 text-lg font-semibold hover:bg-white/20 transition-all duration-300">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Search & Filter Section */}
      <section className="relative z-20 -mt-16 px-4">
        <Container>
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-soft-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search for issues..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {['all', 'pending', 'in-progress', 'resolved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-100/50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Map View Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-gray-900">Explore Environmental Issues</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Browse through reported environmental issues in your area and track their progress through our interactive map.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500">
            <MapView reports={filteredReports} />
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
        <Container className="relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-gray-900">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform empowers you to make a tangible difference in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 text-center group border border-gray-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${feature.gradient} shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <Container className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="px-4 group">
                <div className="flex justify-center mb-4 text-primary-300 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 font-display tracking-tight">{stat.value}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-12 md:p-20 text-white text-center shadow-2xl shadow-primary-500/25">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to make a difference?</h2>
              <p className="text-xl text-primary-50 mb-10 max-w-2xl mx-auto opacity-90">
                Join thousands of citizens already making their communities greener and more sustainable today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-50 shadow-lg border-0"
                >
                  Get Started Now
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="glass"
                  size="lg"
                  className="border-white/40 hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;