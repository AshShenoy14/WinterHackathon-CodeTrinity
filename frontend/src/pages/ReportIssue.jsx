import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ReportIssue() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Report an Issue</h1>
                    <div className="bg-white shadow rounded-lg p-6">
                        <p className="text-gray-500">Report form goes here.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
