// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';

const Home = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Geo-Tagged Reports',
      description: 'Pinpoint environmental issues on an interactive map for accurate tracking and resolution.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Join a growing community of environmentally conscious citizens making a difference.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Track Progress',
      description: 'Monitor the impact of reported issues with real-time updates and analytics.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verified Actions',
      description: 'Trust in our verification system that ensures reports are legitimate and actionable.'
    }
  ];

  const stats = [
    { value: '1,200+', label: 'Reports Submitted' },
    { value: '850+', label: 'Issues Resolved' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-10"></div>
        <Container className="relative py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6 animate-pulse">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Join the movement for a greener planet</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Environmental Concerns</span> Into Action
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              GreenPulse empowers citizens to report environmental issues, track their resolution, and contribute to a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                as={Link} 
                to="/report" 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg hover:shadow-green-200/50 transition-all"
              >
                Report an Issue
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              // Fix the duplicate Button component in the Home page
<Button 
  as={Link} 
  to="/dashboard" 
  variant="outline" 
  size="lg"
  className="border-2 border-green-600 text-green-700 hover:bg-green-50"
>
  View Dashboard
</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to report and track environmental issues in your community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <Card className="p-8 md:p-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to make a difference?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of citizens already making their communities greener and more sustainable.
              </p>
              <Button as={Link} to="/register" size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started Today
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Home;