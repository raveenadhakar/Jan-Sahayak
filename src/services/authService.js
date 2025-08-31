class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // Load users from localStorage
  loadUsers() {
    try {
      const users = localStorage.getItem('janSahayakUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Save users to localStorage
  saveUsers() {
    try {
      localStorage.setItem('janSahayakUsers', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Load current user from localStorage
  loadCurrentUser() {
    try {
      const user = localStorage.getItem('janSahayakCurrentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Save current user to localStorage
  saveCurrentUser(user) {
    try {
      localStorage.setItem('janSahayakCurrentUser', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Check if mobile number already exists
  mobileExists(mobile) {
    return this.users.some(user => user.mobile === mobile);
  }

  // Validate mobile number format
  validateMobile(mobile) {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  // Validate required fields
  validateUserData(userData) {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!this.validateMobile(userData.mobile)) {
      errors.push('Please enter a valid 10-digit mobile number');
    }
    
    if (!userData.village || userData.village.trim().length < 2) {
      errors.push('Village name is required');
    }
    
    if (!userData.district || userData.district.trim().length < 2) {
      errors.push('District name is required');
    }
    
    if (!userData.state || userData.state.trim().length < 2) {
      errors.push('State name is required');
    }

    // Additional validations for enhanced profile
    if (userData.age && (userData.age < 1 || userData.age > 120)) {
      errors.push('Please enter a valid age');
    }

    if (userData.annualIncome && userData.annualIncome < 0) {
      errors.push('Annual income cannot be negative');
    }

    if (userData.familySize && (userData.familySize < 1 || userData.familySize > 20)) {
      errors.push('Please enter a valid family size');
    }

    return errors;
  }

  // Register new user
  async signup(userData) {
    try {
      // Validate user data
      const validationErrors = this.validateUserData(userData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Check if mobile already exists
      if (this.mobileExists(userData.mobile)) {
        throw new Error('Mobile number already registered. Please login instead.');
      }

      // Create new user
      const newUser = {
        id: this.generateUserId(),
        name: userData.name.trim(),
        mobile: userData.mobile.trim(),
        village: userData.village.trim(),
        district: userData.district.trim(),
        state: userData.state.trim(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      };

      // Add to users array
      this.users.push(newUser);
      this.saveUsers();

      // Set as current user
      this.saveCurrentUser(newUser);

      return {
        success: true,
        user: newUser,
        message: 'Account created successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Login existing user
  async login(mobile) {
    try {
      if (!this.validateMobile(mobile)) {
        throw new Error('Please enter a valid mobile number');
      }

      // Find user by mobile
      const user = this.users.find(u => u.mobile === mobile && u.isActive);
      
      if (!user) {
        throw new Error('Mobile number not found. Please signup first.');
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      this.saveUsers();

      // Set as current user
      this.saveCurrentUser(user);

      return {
        success: true,
        user: user,
        message: 'Login successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout current user
  logout() {
    try {
      localStorage.removeItem('janSahayakCurrentUser');
      this.currentUser = null;
      return {
        success: true,
        message: 'Logged out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error during logout'
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      // Validate user data
      const validationErrors = this.validateUserData(userData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Check if mobile is being changed and if it already exists
      if (userData.mobile !== this.currentUser.mobile && this.mobileExists(userData.mobile)) {
        throw new Error('Mobile number already registered by another user');
      }

      // Find and update user
      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      this.users[userIndex] = {
        ...this.users[userIndex],
        name: userData.name.trim(),
        mobile: userData.mobile.trim(),
        village: userData.village.trim(),
        district: userData.district.trim(),
        state: userData.state.trim(),
        updatedAt: new Date().toISOString()
      };

      this.saveUsers();
      this.saveCurrentUser(this.users[userIndex]);

      return {
        success: true,
        user: this.users[userIndex],
        message: 'Profile updated successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user statistics
  getUserStats() {
    if (!this.currentUser) return null;

    return {
      totalUsers: this.users.length,
      userSince: new Date(this.currentUser.createdAt).toLocaleDateString('hi-IN'),
      lastLogin: new Date(this.currentUser.lastLogin).toLocaleDateString('hi-IN'),
      profileComplete: this.isProfileComplete()
    };
  }

  // Check if profile is complete
  isProfileComplete() {
    if (!this.currentUser) return false;
    
    return !!(
      this.currentUser.name &&
      this.currentUser.mobile &&
      this.currentUser.village &&
      this.currentUser.district &&
      this.currentUser.state
    );
  }

  // Get suggested villages/districts (mock data for now)
  getSuggestions(type, query) {
    const suggestions = {
      villages: [
        'Muzaffarnagar', 'Shamli', 'Baghpat', 'Meerut', 'Ghaziabad',
        'Bulandshahr', 'Aligarh', 'Mathura', 'Agra', 'Firozabad'
      ],
      districts: [
        'Muzaffarnagar', 'Shamli', 'Baghpat', 'Meerut', 'Ghaziabad',
        'Bulandshahr', 'Aligarh', 'Mathura', 'Agra', 'Firozabad',
        'Mainpuri', 'Etah', 'Kasganj', 'Hathras', 'Gautam Buddha Nagar'
      ],
      states: [
        'Uttar Pradesh', 'Haryana', 'Punjab', 'Rajasthan', 'Madhya Pradesh',
        'Bihar', 'Jharkhand', 'West Bengal', 'Odisha', 'Chhattisgarh'
      ]
    };

    if (!query || query.length < 2) return [];
    
    return suggestions[type]?.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) || [];
  }
}

export const authService = new AuthService();