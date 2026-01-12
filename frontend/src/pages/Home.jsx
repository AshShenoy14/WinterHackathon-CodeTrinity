// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Users, TrendingUp, Shield, Zap, Leaf, 
  ArrowRight, CheckCircle, Clock, BarChart2, Search, Globe, Target
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
      icon: <MapPin className="w-6 h-6" />,
      title: 'Geo-Tagged Reports',
      description: 'Pinpoint environmental issues with precise location tracking',
      color: 'from-green-200 via-green-400 to-emerald-300'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'Join thousands making a difference in their communities',
      color: 'from-cyan-200 via-cyan-400 to-blue-300'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Real-time Updates',
      description: 'Track the progress of reported issues in real-time',
      color: 'from-yellow-200 via-yellow-400 to-orange-300'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Verified Actions',
      description: 'Trust in our verification system for legitimate reports',
      color: 'from-pink-200 via-pink-400 to-rose-300'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white pt-24 pb-16 md:pt-32 md:pb-24 animate-fade-in">
        {/* Hero background image with overlay */}
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Green landscape" className="absolute inset-0 w-full h-full object-cover object-center opacity-60 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-700/80 via-emerald-800/60 to-cyan-900/60" />
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-lg animate-fade-in-down">
              Empowering Communities for a <span className="bg-gradient-to-r from-green-300 via-emerald-200 to-cyan-200 bg-clip-text text-transparent">Greener Tomorrow</span>
            </h1>
            <p className="text-lg md:text-xl font-medium mb-8 text-white/90 animate-fade-in-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Report, track, and resolve environmental issues in your area. Join the movement to make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <Link to="/report">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-200">
                  Report an Issue <ArrowRight className="inline ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-white/90 hover:bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg border border-green-200 transition-all duration-200">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Search & Filter Section */}
      <section className="relative z-10 -mt-12 px-4">
        <Container>
          <Card className="p-6 shadow-xl border-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for issues..."
                  className="input-field pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['all', 'pending', 'in-progress', 'resolved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* Map View Section */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Environmental Issues</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through reported environmental issues in your area and track their progress
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden">
            <MapView reports={filteredReports} />
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to report and track environmental issues in your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center group border-0 shadow-xl transition-colors bg-gradient-to-br hover:scale-105 duration-200 hover:shadow-2xl hover:brightness-105"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform shadow-lg`}> 
                  {/* Add a relevant feature image/icon */}
                  <img
                    src={
                      index === 0 ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80'
                        : index === 1 ? 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=100&q=80'
                        : index === 2 ? 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80'
                        : 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={feature.title}
                    className="w-10 h-10 object-cover rounded-xl border-2 border-white shadow"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-700 font-medium">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 md:p-12 text-white">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Join thousands of citizens already making their communities greener and more sustainable.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  as={Link}
                  to="/register"
                  className="bg-white text-green-700 hover:bg-gray-100"
                >
                  Get Started
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="ghost"
                  className="text-white border-white/30 hover:bg-white/10"
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