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
      description: 'Pinpoint environmental issues with precise location tracking'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description:'Join thousands making a difference in their communities'
    },
    {
  icon: <TrendingUp className="w-6 h-6" />,
  title: 'Real-time Updates',
  description: 'Track the progress of reported issues in real-time'
},

    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Verified Actions',
      desciption:'Trust in our verification system for legitimate reports'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')]"></div>
        </div>
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 animate-float">
              <Zap className="w-4 h-4 mr-2 text-yellow-300" />
              <span>Join the movement for a greener planet</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Environmental Concerns
              </span> Into Action
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
              GreenPulse empowers citizens to report environmental issues, track their resolution, and contribute to a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                as={Link}
                to="/report"
                className="btn-primary inline-flex items-center"
              >
                Report an Issue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                as={Link}
                to="/dashboard"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20"
              >
                View Dashboard
              </Button>
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
              <Card key={index} className="p-6 text-center group hover:border-green-200 transition-colors">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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