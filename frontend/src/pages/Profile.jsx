// src/pages/Profile.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import { User, Mail, Award, MapPin } from 'lucide-react';

export default function Profile() {
    const user = {
        name: "Eco Guardian",
        email: "guardian@greenpulse.app",
        reportsSubmitted: 12,
        points: 450,
        memberSince: "Dec 2025"
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 p-6 text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-gray-500 mb-4">{user.email}</p>
                            <div className="flex justify-center gap-2">
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Award className="w-3 h-3" /> Gold Contributor
                                </span>
                            </div>
                        </Card>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 bg-blue-50">
                                    <p className="text-gray-600 text-sm">Reports Submitted</p>
                                    <p className="text-2xl font-bold text-blue-600">{user.reportsSubmitted}</p>
                                </Card>
                                <Card className="p-4 bg-green-50">
                                    <p className="text-gray-600 text-sm">Eco Points Earned</p>
                                    <p className="text-2xl font-bold text-green-600">{user.points}</p>
                                </Card>
                            </div>
                            <Card className="p-6">
                                <h3 className="font-bold mb-4">Account Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600">Join Date</span>
                                        <span>{user.memberSince}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600">Primary Location</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> Downtown</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}