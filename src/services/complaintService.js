// Import the shared service
import { sharedComplaintService } from './sharedComplaintService';

class ComplaintService {
  constructor() {
    // Use the shared service instead of local storage
    this.sharedService = sharedComplaintService;
  }

  // Initialize with sample complaints for demo
  initializeSampleComplaints() {
    const sampleComplaints = [
      {
        id: 'CMP1001',
        title: 'सड़क की खराब स्थिति',
        description: 'मुख्य सड़क पर बड़े गड्ढे हैं जिससे वाहन चलाने में परेशानी हो रही है। बारिश के समय पानी भर जाता है।',
        category: 'infrastructure',
        priority: 'high',
        status: 'submitted',
        location: 'मुजफ्फरनगर, उत्तर प्रदेश',
        contactNumber: '+91-9876543210',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        userId: 'demo-user-1',
        updates: [
          {
            status: 'submitted',
            message: 'शिकायत प्राप्त हुई है और समीक्षा के लिए भेजी गई है।',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'System'
          }
        ]
      },
      {
        id: 'CMP1002',
        title: 'पानी की समस्या',
        description: 'हमारे क्षेत्र में पिछले 3 दिनों से पानी की आपूर्ति नहीं हो रही है। हैंडपंप भी काम नहीं कर रहा।',
        category: 'water',
        priority: 'high',
        status: 'under_review',
        location: 'शामली, उत्तर प्रदेश',
        contactNumber: '+91-9876543211',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        userId: 'demo-user-2',
        updates: [
          {
            status: 'submitted',
            message: 'शिकायत प्राप्त हुई है।',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'System'
          },
          {
            status: 'under_review',
            message: 'जल विभाग को भेजा गया है। जांच की जा रही है।',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Water Department'
          }
        ]
      },
      {
        id: 'CMP1003',
        title: 'बिजली की कटौती',
        description: 'दिन में 8-10 घंटे बिजली कटौती हो रही है। खेती और घरेलू काम में बहुत परेशानी हो रही है।',
        category: 'electricity',
        priority: 'medium',
        status: 'in_progress',
        location: 'बागपत, उत्तर प्रदेश',
        contactNumber: '+91-9876543212',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        userId: 'demo-user-3',
        updates: [
          {
            status: 'submitted',
            message: 'शिकायत प्राप्त हुई है।',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'System'
          },
          {
            status: 'under_review',
            message: 'विद्युत विभाग को भेजा गया है।',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Electricity Board'
          },
          {
            status: 'in_progress',
            message: 'ट्रांसफार्मर की मरम्मत का काम शुरू किया गया है।',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Technical Team'
          }
        ]
      },
      {
        id: 'CMP1004',
        title: 'स्वास्थ्य केंद्र में दवाई नहीं',
        description: 'प्राथमिक स्वास्थ्य केंद्र में बुनियादी दवाइयां उपलब्ध नहीं हैं। डॉक्टर भी नियमित नहीं आते।',
        category: 'health',
        priority: 'high',
        status: 'resolved',
        location: 'मेरठ, उत्तर प्रदेश',
        contactNumber: '+91-9876543213',
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        userId: 'demo-user-4',
        updates: [
          {
            status: 'submitted',
            message: 'शिकायत प्राप्त हुई है।',
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'System'
          },
          {
            status: 'under_review',
            message: 'स्वास्थ्य विभाग को भेजा गया है।',
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Health Department'
          },
          {
            status: 'in_progress',
            message: 'दवाइयों की आपूर्ति की व्यवस्था की जा रही है।',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Medical Officer'
          },
          {
            status: 'resolved',
            message: 'दवाइयों की आपूर्ति हो गई है और नियमित डॉक्टर की व्यवस्था की गई है।',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'Chief Medical Officer'
          }
        ]
      },
      {
        id: 'CMP1005',
        title: 'स्कूल में शिक्षक नहीं',
        description: 'प्राथमिक विद्यालय में गणित के शिक्षक नहीं हैं। बच्चों की पढ़ाई प्रभावित हो रही है।',
        category: 'education',
        priority: 'medium',
        status: 'submitted',
        location: 'गाजियाबाद, उत्तर प्रदेश',
        contactNumber: '+91-9876543214',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        userId: 'demo-user-5',
        updates: [
          {
            status: 'submitted',
            message: 'शिकायत प्राप्त हुई है और शिक्षा विभाग को भेजी गई है।',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedBy: 'System'
          }
        ]
      }
    ];

    this.complaints = sampleComplaints;
    this.saveComplaints();
  }

  // Load complaints from localStorage
  loadComplaints() {
    try {
      const complaints = localStorage.getItem('janSahayakComplaints');
      return complaints ? JSON.parse(complaints) : [];
    } catch (error) {
      console.error('Error loading complaints:', error);
      return [];
    }
  }

  // Save complaints to localStorage
  saveComplaints() {
    try {
      localStorage.setItem('janSahayakComplaints', JSON.stringify(this.complaints));
    } catch (error) {
      console.error('Error saving complaints:', error);
    }
  }

  // Generate unique complaint ID
  generateComplaintId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `CMP${timestamp}${random}`.toUpperCase();
  }

  // Validate complaint data
  validateComplaint(complaintData) {
    const errors = [];
    
    if (!complaintData.title || complaintData.title.trim().length < 5) {
      errors.push('Complaint title must be at least 5 characters long');
    }
    
    if (!complaintData.description || complaintData.description.trim().length < 10) {
      errors.push('Complaint description must be at least 10 characters long');
    }
    
    if (!complaintData.category) {
      errors.push('Please select a complaint category');
    }
    
    if (!complaintData.priority) {
      errors.push('Please select complaint priority');
    }

    return errors;
  }

  // File a new complaint
  async fileComplaint(complaintData, userId) {
    try {
      if (!userId) {
        throw new Error('User must be logged in to file a complaint');
      }

      // Validate complaint data
      const validationErrors = this.validateComplaint(complaintData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      return this.sharedService.addComplaint(complaintData, userId);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get complaints for a specific user
  getUserComplaints(userId) {
    return this.sharedService.getUserComplaints(userId);
  }

  // Get complaint by ID (only if it belongs to the user)
  getComplaintById(complaintId, userId) {
    return this.complaints.find(
      complaint => complaint.id === complaintId && complaint.userId === userId
    );
  }

  // Update complaint status (simulate government response)
  async updateComplaintStatus(complaintId, newStatus, note = '') {
    return this.sharedService.updateComplaintStatus(complaintId, newStatus, note);
  }

  // Get estimated resolution time
  getEstimatedResolution(category, priority) {
    const baseDays = {
      'infrastructure': 15,
      'water': 7,
      'electricity': 5,
      'sanitation': 10,
      'healthcare': 3,
      'education': 12,
      'agriculture': 8,
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

  // Get assigned department
  getAssignedDepartment(category) {
    const departments = {
      'infrastructure': 'लोक निर्माण विभाग',
      'water': 'जल निगम',
      'electricity': 'विद्युत विभाग',
      'sanitation': 'स्वच्छता विभाग',
      'healthcare': 'स्वास्थ्य विभाग',
      'education': 'शिक्षा विभाग',
      'agriculture': 'कृषि विभाग',
      'other': 'जिला प्रशासन'
    };

    return departments[category] || 'जिला प्रशासन';
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

  // Get complaint statistics for user
  getUserComplaintStats(userId) {
    const userComplaints = this.getUserComplaints(userId);
    
    const stats = {
      total: userComplaints.length,
      submitted: 0,
      under_review: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      rejected: 0
    };

    userComplaints.forEach(complaint => {
      stats[complaint.status] = (stats[complaint.status] || 0) + 1;
    });

    return stats;
  }

  // Simulate automatic status updates (for demo purposes)
  simulateStatusUpdates() {
    const pendingComplaints = this.complaints.filter(
      c => ['submitted', 'under_review', 'in_progress'].includes(c.status)
    );

    pendingComplaints.forEach(complaint => {
      const daysSinceCreated = Math.floor(
        (new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24)
      );

      // Simulate progression based on days
      if (daysSinceCreated >= 1 && complaint.status === 'submitted') {
        this.updateComplaintStatus(complaint.id, 'under_review');
      } else if (daysSinceCreated >= 3 && complaint.status === 'under_review') {
        this.updateComplaintStatus(complaint.id, 'in_progress');
      } else if (daysSinceCreated >= 7 && complaint.status === 'in_progress') {
        this.updateComplaintStatus(complaint.id, 'resolved');
      }
    });
  }

  // Get complaint categories
  getComplaintCategories() {
    return [
      { id: 'infrastructure', name: 'बुनियादी ढांचा', icon: '🏗️' },
      { id: 'water', name: 'पानी की समस्या', icon: '💧' },
      { id: 'electricity', name: 'बिजली', icon: '⚡' },
      { id: 'sanitation', name: 'स्वच्छता', icon: '🧹' },
      { id: 'healthcare', name: 'स्वास्थ्य सेवा', icon: '🏥' },
      { id: 'education', name: 'शिक्षा', icon: '📚' },
      { id: 'agriculture', name: 'कृषि', icon: '🌾' },
      { id: 'other', name: 'अन्य', icon: '📝' }
    ];
  }

  // Get priority levels
  getPriorityLevels() {
    return [
      { id: 'high', name: 'उच्च', color: 'text-red-600', bgColor: 'bg-red-100' },
      { id: 'medium', name: 'मध्यम', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      { id: 'low', name: 'कम', color: 'text-green-600', bgColor: 'bg-green-100' }
    ];
  }

  // Download complaint receipt
  downloadComplaintReceipt(complaintId, userId) {
    const complaint = this.getComplaintById(complaintId, userId);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Create receipt content
    const receiptContent = `
शिकायत रसीद / Complaint Receipt
================================

शिकायत संख्या: ${complaint.id}
दिनांक: ${new Date(complaint.createdAt).toLocaleDateString('hi-IN')}
समय: ${new Date(complaint.createdAt).toLocaleTimeString('hi-IN')}

शिकायत विवरण:
शीर्षक: ${complaint.title}
विवरण: ${complaint.description}
श्रेणी: ${complaint.category}
प्राथमिकता: ${complaint.priority}
स्थिति: ${complaint.status}

संपर्क जानकारी:
मोबाइल: ${complaint.contactNumber}
स्थान: ${complaint.location}

विभाग: ${complaint.assignedDepartment}
अनुमानित समाधान: ${complaint.estimatedResolution.displayDate}

स्थिति इतिहास:
${complaint.statusHistory.map(h => 
  `${new Date(h.timestamp).toLocaleDateString('hi-IN')} - ${h.status}: ${h.note}`
).join('\n')}

================================
जन सहायक - डिजिटल इंडिया पहल
    `;

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `complaint_${complaint.id}_receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'Receipt downloaded successfully'
    };
  }
}

export const complaintService = new ComplaintService();