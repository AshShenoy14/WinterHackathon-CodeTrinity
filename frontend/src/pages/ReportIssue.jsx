// src/pages/ReportIssue.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/ui/Button';
import { Camera, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportIssue() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Waste Management'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd send this to Firebase/Firestore here
        console.log('Reporting Issue:', formData);
        toast.success('Report submitted successfully! Our team will review it.');
        setFormData({ title: '', description: '', location: '', category: 'Waste Management' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Report an Environmental Issue</h1>
                    <div className="max-w-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 shadow-xl rounded-2xl p-8 border border-emerald-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-emerald-700">Issue Title</label>
                                <input 
                                    type="text" required
                                    className="mt-1 block w-full input-field focus:ring-cyan-400 focus:border-cyan-400"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g., Illegal Dumping in Park"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-emerald-700">Category</label>
                                    <select 
                                        className="mt-1 block w-full input-field focus:ring-cyan-400 focus:border-cyan-400"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option>Waste Management</option>
                                        <option>Air Quality</option>
                                        <option>Water Pollution</option>
                                        <option>Deforestation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-emerald-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2 top-3 h-4 w-4 text-cyan-400" />
                                        <input 
                                            type="text" required
                                            className="mt-1 block w-full input-field pl-8 focus:ring-cyan-400 focus:border-cyan-400"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            placeholder="Street or Area"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-emerald-700">Description</label>
                                <textarea 
                                    rows="4" required
                                    className="mt-1 block w-full input-field focus:ring-cyan-400 focus:border-cyan-400"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the environmental concern in detail..."
                                />
                            </div>
                            <Button type="submit" className="w-full flex gap-2 btn-primary text-lg font-bold shadow-lg">
                                <Send className="w-5 h-5" /> Submit Report
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}