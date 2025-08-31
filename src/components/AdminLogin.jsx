import React, { useState } from 'react';
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

const AdminLogin = ({ selectedLanguage = 'hi' }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Demo admin credentials
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    const translations = {
        hi: {
            adminLogin: 'प्रशासनिक लॉगिन',
            username: 'उपयोगकर्ता नाम',
            password: 'पासवर्ड',
            login: 'लॉगिन करें',
            invalidCredentials: 'गलत उपयोगकर्ता नाम या पासवर्ड',
            demoCredentials: 'डेमो क्रेडेंशियल्स: admin / admin123',
            adminPanel: 'प्रशासनिक पैनल',
            logout: 'लॉगआउट'
        },
        en: {
            adminLogin: 'Admin Login',
            username: 'Username',
            password: 'Password',
            login: 'Login',
            invalidCredentials: 'Invalid username or password',
            demoCredentials: 'Demo Credentials: admin / admin123',
            adminPanel: 'Admin Panel',
            logout: 'Logout'
        }
    };

    const t = translations[selectedLanguage] || translations.hi;

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (credentials.username === adminCredentials.username && 
            credentials.password === adminCredentials.password) {
            setIsLoggedIn(true);
        } else {
            setError(t.invalidCredentials);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCredentials({ username: '', password: '' });
        setError('');
    };

    if (isLoggedIn) {
        return (
            <div>
                <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40 mb-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-500 p-2 rounded-lg">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-800">{t.adminPanel}</h1>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdminDashboard selectedLanguage={selectedLanguage} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{t.adminLogin}</h2>
                    <p className="text-gray-600 mt-2">सरकारी अधिकारियों के लिए</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    💡 {t.demoCredentials}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.username}
                        </label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.password}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all pr-12"
                                placeholder="admin123"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 transition-all font-semibold flex items-center justify-center space-x-2"
                    >
                        <LogIn className="w-5 h-5" />
                        <span>{t.login}</span>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>🏛️ भारत सरकार | Government of India</p>
                    <p>डिजिटल इंडिया पहल</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;