import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <span className="text-xl font-bold text-gray-900">GreenPulse</span>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">Log in</Link>
                    <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Get Started</Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        Report Environmental <span className="text-green-600">Issues</span> Instantly
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Join your community in making the world a cleaner, safer place. Report waste, pollution, and hazards with just a few clicks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/dashboard" className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/report" className="px-8 py-3 bg-white text-green-600 border border-green-200 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center">
                            Report an Issue
                        </Link>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-green-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Environmental protection"
                        className="relative rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    );
}
