import React, { useState, useEffect } from 'react';
import {
    Users, FileText, CheckCircle, Clock, AlertTriangle,
    Eye, MessageSquare, Filter, Search, Download, RefreshCw,
    User, Calendar, MapPin, Phone, Mail, Building2, Award
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { authService } from '../services/authService';

const AdminDashboard = ({ selectedLanguage = 'hi' }) => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateNote, setUpdateNote] = useState('');
    const [newStatus, setNewStatus] = useState('');

    // Admin translations
    const translations = {
        hi: {
            adminDashboard: 'प्रशासनिक डैशबोर्ड',
            allComplaints: 'सभी शिकायतें',
            complaintManagement: 'शिकायत प्रबंधन',
            totalComplaints: 'कुल शिकायतें',
            pendingReview: 'समीक्षा में',
            inProgress: 'प्रगति में',
            resolved: 'हल हुई',
            filterBy: 'फिल्टर करें',
            status: 'स्थिति',
            priority: 'प्राथमिकता',
            category: 'श्रेणी',
            search: 'खोजें',
            viewDetails: 'विवरण देखें',
            updateStatus: 'स्थिति अपडेट करें',
            addNote: 'टिप्पणी जोड़ें',
            update: 'अपडेट करें',
            cancel: 'रद्द करें',
            complaintDetails: 'शिकायत विवरण',
            citizenInfo: 'नागरिक जानकारी',
            statusHistory: 'स्थिति इतिहास',
            assignToDepartment: 'विभाग को सौंपें',
            downloadReport: 'रिपोर्ट डाउनलोड करें',
            refresh: 'रीफ्रेश करें',
            all: 'सभी',
            submitted: 'दर्ज की गई',
            under_review: 'समीक्षा में',
            in_progress: 'प्रगति में',
            resolved: 'हल हुई',
            closed: 'बंद',
            rejected: 'अस्वीकृत',
            high: 'उच्च',
            medium: 'मध्यम',
            low: 'निम्न',
            infrastructure: 'बुनियादी ढांचा',
            water: 'पानी',
            electricity: 'बिजली',
            health: 'स्वास्थ्य',
            education: 'शिक्षा',
            other: 'अन्य'
        },
        en: {
            adminDashboard: 'Admin Dashboard',
            allComplaints: 'All Complaints',
            complaintManagement: 'Complaint Management',
            totalComplaints: 'Total Complaints',
            pendingReview: 'Pending Review',
            inProgress: 'In Progress',
            resolved: 'Resolved',
            filterBy: 'Filter By',
            status: 'Status',
            priority: 'Priority',
            category: 'Category',
            search: 'Search',
            viewDetails: 'View Details',
            updateStatus: 'Update Status',
            addNote: 'Add Note',
            update: 'Update',
            cancel: 'Cancel',
            complaintDetails: 'Complaint Details',
            citizenInfo: 'Citizen Information',
            statusHistory: 'Status History',
            assignToDepartment: 'Assign to Department',
            downloadReport: 'Download Report',
            refresh: 'Refresh',
            all: 'All',
            submitted: 'Submitted',
            under_review: 'Under Review',
            in_progress: 'In Progress',
            resolved: 'Resolved',
            closed: 'Closed',
            rejected: 'Rejected',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            infrastructure: 'Infrastructure',
            water: 'Water',
            electricity: 'Electricity',
            health: 'Health',
            education: 'Education',
            other: 'Other'
        }
    };

    const t = translations[selectedLanguage] || translations.hi;

    useEffect(() => {
        loadAllComplaints();
    }, []);

    useEffect(() => {
        filterComplaints();
    }, [complaints, statusFilter, priorityFilter, categoryFilter, searchTerm]);

    const loadAllComplaints = () => {
        setIsLoading(true);
        try {
            // Get all complaints from the service
            const allComplaints = complaintService.complaints || [];
            setComplaints(allComplaints);
        } catch (error) {
            console.error('Error loading complaints:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterComplaints = () => {
        let filtered = [...complaints];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Filter by priority
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(c => c.priority === priorityFilter);
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(c => c.category === categoryFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredComplaints(filtered);
    };

    const handleStatusUpdate = async () => {
        if (!selectedComplaint || !newStatus) return;

        try {
            await complaintService.updateComplaintStatus(
                selectedComplaint.id,
                newStatus,
                updateNote || `Status updated to ${newStatus} by admin`
            );

            // Refresh complaints
            loadAllComplaints();
            setShowUpdateModal(false);
            setUpdateNote('');
            setNewStatus('');
            setSelectedComplaint(null);
        } catch (error) {
            console.error('Error updating complaint:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'under_review': return 'bg-orange-100 text-orange-800';
            case 'submitted': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStats = () => {
        const total = complaints.length;
        const submitted = complaints.filter(c => c.status === 'submitted').length;
        const underReview = complaints.filter(c => c.status === 'under_review').length;
        const inProgress = complaints.filter(c => c.status === 'in_progress').length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;

        return { total, submitted, underReview, inProgress, resolved };
    };

    const stats = getStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading complaints...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">{t.adminDashboard}</h1>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={loadAllComplaints}
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>{t.refresh}</span>
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>{t.downloadReport}</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t.totalComplaints}</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t.submitted}</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <Eye className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t.under_review}</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.underReview}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t.in_progress}</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t.resolved}</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.resolved}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.filterBy}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">{t.all}</option>
                            <option value="submitted">{t.submitted}</option>
                            <option value="under_review">{t.under_review}</option>
                            <option value="in_progress">{t.in_progress}</option>
                            <option value="resolved">{t.resolved}</option>
                            <option value="closed">{t.closed}</option>
                            <option value="rejected">{t.rejected}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.priority}</label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">{t.all}</option>
                            <option value="high">{t.high}</option>
                            <option value="medium">{t.medium}</option>
                            <option value="low">{t.low}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">{t.all}</option>
                            <option value="infrastructure">{t.infrastructure}</option>
                            <option value="water">{t.water}</option>
                            <option value="electricity">{t.electricity}</option>
                            <option value="health">{t.health}</option>
                            <option value="education">{t.education}</option>
                            <option value="other">{t.other}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.search}</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search complaints..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Complaints List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">
                        {t.allComplaints} ({filteredComplaints.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredComplaints.map((complaint) => (
                                <tr key={complaint.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {complaint.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="max-w-xs truncate">{complaint.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {t[complaint.category]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>
                                            {t[complaint.priority]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                            {t[complaint.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(complaint.createdAt).toLocaleDateString('hi-IN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => setSelectedComplaint(complaint)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedComplaint(complaint);
                                                setShowUpdateModal(true);
                                                setNewStatus(complaint.status);
                                            }}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complaint Details Modal */}
            {selectedComplaint && !showUpdateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">{t.complaintDetails}</h3>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Complaint Info */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-3">Complaint Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-600">ID:</span>
                                            <p className="font-semibold">{selectedComplaint.id}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Title:</span>
                                            <p className="font-semibold">{selectedComplaint.title}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Description:</span>
                                            <p className="text-gray-700">{selectedComplaint.description}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-gray-600">Category:</span>
                                                <p className="font-semibold">{t[selectedComplaint.category]}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Priority:</span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedComplaint.priority)}`}>
                                                    {t[selectedComplaint.priority]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Citizen Info */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-3">{t.citizenInfo}</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span>{selectedComplaint.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span>{selectedComplaint.contactNumber}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span>{selectedComplaint.assignedDepartment}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status History */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">{t.statusHistory}</h4>
                                <div className="space-y-3">
                                    {selectedComplaint.statusHistory?.map((update, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(update.status)}`}>
                                                    {t[update.status]}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(update.timestamp).toLocaleDateString('hi-IN')}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">{update.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t">
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowUpdateModal(true);
                                    setNewStatus(selectedComplaint.status);
                                }}
                                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                            >
                                {t.updateStatus}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showUpdateModal && selectedComplaint && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{t.updateStatus}</h3>
                            <button
                                onClick={() => {
                                    setShowUpdateModal(false);
                                    setUpdateNote('');
                                    setNewStatus('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="submitted">{t.submitted}</option>
                                    <option value="under_review">{t.under_review}</option>
                                    <option value="in_progress">{t.in_progress}</option>
                                    <option value="resolved">{t.resolved}</option>
                                    <option value="closed">{t.closed}</option>
                                    <option value="rejected">{t.rejected}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.addNote}</label>
                                <textarea
                                    value={updateNote}
                                    onChange={(e) => setUpdateNote(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                                    placeholder="Add a note about this status update..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowUpdateModal(false);
                                    setUpdateNote('');
                                    setNewStatus('');
                                }}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                            >
                                {t.update}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;