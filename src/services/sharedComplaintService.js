// Shared complaint service that syncs between main app and admin dashboard
class SharedComplaintService {
    constructor() {
        this.storageKey = 'samudayikAwaazComplaints';
        this.listeners = new Set();
        this.initializeData();
        
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.notifyListeners();
            }
        });
    }

    initializeData() {
        const existing = this.getComplaints();
        if (existing.length === 0) {
            // Initialize with sample data
            const sampleComplaints = [
                {
                    id: 'CMP1001',
                    title: 'सड़क की खराब स्थिति',
                    description: 'मुख्य सड़क पर बड़े गड्ढे हैं जिससे वाहन चलाने में परेशानी हो रही है।',
                    category: 'infrastructure',
                    priority: 'high',
                    status: 'submitted',
                    location: 'मुजफ्फरनगर, उत्तर प्रदेश',
                    contactNumber: '+91-9876543210',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    userId: 'demo-user-1',
                    assignedDepartment: 'लोक निर्माण विभाग',
                    statusHistory: [
                        {
                            status: 'submitted',
                            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                            note: 'शिकायत प्राप्त हुई है और समीक्षा के लिए भेजी गई है।'
                        }
                    ]
                },
                {
                    id: 'CMP1002',
                    title: 'पानी की समस्या',
                    description: 'हमारे क्षेत्र में पिछले 3 दिनों से पानी की आपूर्ति नहीं हो रही है।',
                    category: 'water',
                    priority: 'high',
                    status: 'under_review',
                    location: 'शामली, उत्तर प्रदेश',
                    contactNumber: '+91-9876543211',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    userId: 'demo-user-2',
                    assignedDepartment: 'जल निगम',
                    statusHistory: [
                        {
                            status: 'submitted',
                            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                            note: 'शिकायत प्राप्त हुई है।'
                        },
                        {
                            status: 'under_review',
                            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            note: 'जल विभाग को भेजा गया है। जांच की जा रही है।'
                        }
                    ]
                }
            ];
            this.saveComplaints(sampleComplaints);
        }
    }

    // Get all complaints from localStorage
    getComplaints() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading complaints:', error);
            return [];
        }
    }

    // Save complaints to localStorage
    saveComplaints(complaints) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(complaints));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving complaints:', error);
        }
    }

    // Add a new complaint
    addComplaint(complaintData, userId) {
        const complaints = this.getComplaints();
        const newComplaint = {
            id: this.generateComplaintId(),
            userId: userId,
            title: complaintData.title.trim(),
            description: complaintData.description.trim(),
            category: complaintData.category,
            priority: complaintData.priority,
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            location: complaintData.location || '',
            contactNumber: complaintData.contactNumber || '',
            attachments: complaintData.attachments || [],
            statusHistory: [
                {
                    status: 'submitted',
                    timestamp: new Date().toISOString(),
                    note: 'शिकायत सफलतापूर्वक दर्ज की गई है।'
                }
            ],
            estimatedResolution: this.getEstimatedResolution(complaintData.category, complaintData.priority),
            assignedDepartment: this.getAssignedDepartment(complaintData.category)
        };

        complaints.push(newComplaint);
        this.saveComplaints(complaints);
        return { success: true, complaint: newComplaint };
    }

    // Update complaint status (for admin)
    updateComplaintStatus(complaintId, newStatus, note = '') {
        const complaints = this.getComplaints();
        const complaintIndex = complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
            return { success: false, error: 'Complaint not found' };
        }

        complaints[complaintIndex].status = newStatus;
        complaints[complaintIndex].updatedAt = new Date().toISOString();
        
        complaints[complaintIndex].statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || this.getStatusNote(newStatus)
        });

        this.saveComplaints(complaints);
        return { success: true, complaint: complaints[complaintIndex] };
    }

    // Get complaints for a specific user
    getUserComplaints(userId) {
        const complaints = this.getComplaints();
        return complaints
            .filter(complaint => complaint.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Generate unique complaint ID
    generateComplaintId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        return `CMP${timestamp}${random}`.toUpperCase();
    }

    // Get assigned department
    getAssignedDepartment(category) {
        const departments = {
            'infrastructure': 'लोक निर्माण विभाग',
            'water': 'जल निगम',
            'electricity': 'विद्युत विभाग',
            'health': 'स्वास्थ्य विभाग',
            'education': 'शिक्षा विभाग',
            'other': 'जिला प्रशासन'
        };
        return departments[category] || 'जिला प्रशासन';
    }

    // Get estimated resolution time
    getEstimatedResolution(category, priority) {
        const baseDays = {
            'infrastructure': 15,
            'water': 7,
            'electricity': 5,
            'health': 3,
            'education': 12,
            'other': 10
        };

        const priorityMultiplier = {
            'high': 0.5,
            'medium': 1,
            'low': 1.5
        };

        const days = Math.ceil((baseDays[category] || 10) * (priorityMultiplier[priority] || 1));
        const resolutionDate = new Date();
        resolutionDate.setDate(resolutionDate.getDate() + days);

        return {
            days: days,
            expectedDate: resolutionDate.toISOString(),
            displayDate: resolutionDate.toLocaleDateString('hi-IN')
        };
    }

    // Get status note
    getStatusNote(status) {
        const notes = {
            'submitted': 'शिकायत प्राप्त हुई और समीक्षा के लिए भेजी गई',
            'under_review': 'शिकायत की जांच की जा रही है',
            'in_progress': 'शिकायत का समाधान प्रगति में है',
            'resolved': 'शिकायत का समाधान हो गया है',
            'closed': 'शिकायत बंद कर दी गई है',
            'rejected': 'शिकायत अस्वीकार कर दी गई है'
        };
        return notes[status] || 'स्थिति अपडेट की गई';
    }

    // Add listener for real-time updates
    addListener(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Notify all listeners of changes
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in complaint listener:', error);
            }
        });
    }

    // Get complaint statistics
    getStats() {
        const complaints = this.getComplaints();
        const total = complaints.length;
        const submitted = complaints.filter(c => c.status === 'submitted').length;
        const underReview = complaints.filter(c => c.status === 'under_review').length;
        const inProgress = complaints.filter(c => c.status === 'in_progress').length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;
        const closed = complaints.filter(c => c.status === 'closed').length;
        const rejected = complaints.filter(c => c.status === 'rejected').length;

        return { total, submitted, underReview, inProgress, resolved, closed, rejected };
    }
}

// Create a singleton instance
export const sharedComplaintService = new SharedComplaintService();

// For backward compatibility, also export as default
export default sharedComplaintService;