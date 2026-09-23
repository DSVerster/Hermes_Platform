import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import {
    User,
    Building2,
    Package,
    Palette,
    Sun,
    Moon,
    Save,
    Mail,
    Phone,
    MapPin,
    DollarSign,
} from 'lucide-react';

type Tab = 'profile' | 'application' | 'parcels' | 'appearance';

export default function Index() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // Profile state
    const [profile, setProfile] = useState({
        name: 'Admin',
        surname: 'Admin',
        email: 'admin@gmail.com',
        phone: '',
    });

    // Application state
    const [app, setApp] = useState({
        companyName: 'Hermes Platform',
        contactEmail: 'info@hermes.co.za',
        contactPhone: '+27 11 123 4567',
        address: '123 Main Street, Johannesburg, South Africa',
    });

    // Parcel settings state
    const [parcelSettings, setParcelSettings] = useState({
        defaultFee: '50.00',
        currency: 'ZAR',
        currencySymbol: 'R',
        autoTrackingNumber: true,
        trackingPrefix: 'HP-',
    });

    const toggleDarkMode = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const tabs = [
        { id: 'profile' as Tab, label: 'Profile', icon: User },
        { id: 'application' as Tab, label: 'Application', icon: Building2 },
        { id: 'parcels' as Tab, label: 'Parcel Settings', icon: Package },
        { id: 'appearance' as Tab, label: 'Appearance', icon: Palette },
    ];

    const handleSave = (section: string) => {
        alert(`${section} settings saved successfully!`);
    };

    return (
        <DashboardLayout title="Settings">
            <Head title="Settings" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your application preferences and configuration.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 flex-shrink-0">
                        <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-[#2d1b4e] dark:bg-[#4a1a6b] text-white'
                                            : 'bg-white dark:bg-[#2d1b4e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3d2b5e]'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white dark:bg-[#2d1b4e] rounded-lg shadow p-6 transition-colors duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Profile Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Surname
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.surname}
                                                onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+27 ..."
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => handleSave('Profile')}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#f5a623] text-white rounded-lg hover:bg-[#e09520] transition"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Application Tab */}
                        {activeTab === 'application' && (
                            <div className="bg-white dark:bg-[#2d1b4e] rounded-lg shadow p-6 transition-colors duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Application Settings
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={app.companyName}
                                            onChange={(e) => setApp({ ...app, companyName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Contact Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={app.contactEmail}
                                                onChange={(e) => setApp({ ...app, contactEmail: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Contact Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={app.contactPhone}
                                                onChange={(e) => setApp({ ...app, contactPhone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Business Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <textarea
                                                value={app.address}
                                                onChange={(e) => setApp({ ...app, address: e.target.value })}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => handleSave('Application')}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#f5a623] text-white rounded-lg hover:bg-[#e09520] transition"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Parcel Settings Tab */}
                        {activeTab === 'parcels' && (
                            <div className="bg-white dark:bg-[#2d1b4e] rounded-lg shadow p-6 transition-colors duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Parcel Configuration
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Default Collection Fee
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={parcelSettings.defaultFee}
                                                    onChange={(e) => setParcelSettings({ ...parcelSettings, defaultFee: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Standard fee applied to new parcels (in Rands)
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Currency
                                            </label>
                                            <select
                                                value={parcelSettings.currency}
                                                onChange={(e) => setParcelSettings({ ...parcelSettings, currency: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                            >
                                                <option value="ZAR">ZAR - South African Rand</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Currency Symbol
                                        </label>
                                        <input
                                            type="text"
                                            value={parcelSettings.currencySymbol}
                                            onChange={(e) => setParcelSettings({ ...parcelSettings, currencySymbol: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a0f2e] rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Auto-generate Tracking Numbers
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Automatically assign tracking numbers to new parcels
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={parcelSettings.autoTrackingNumber}
                                                onChange={(e) => setParcelSettings({ ...parcelSettings, autoTrackingNumber: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f5a623]/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f5a623]"></div>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tracking Number Prefix
                                        </label>
                                        <input
                                            type="text"
                                            value={parcelSettings.trackingPrefix}
                                            onChange={(e) => setParcelSettings({ ...parcelSettings, trackingPrefix: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f5a623] focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Prefix used for auto-generated tracking numbers (e.g., HP-12345678)
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => handleSave('Parcel Settings')}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#f5a623] text-white rounded-lg hover:bg-[#e09520] transition"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="bg-white dark:bg-[#2d1b4e] rounded-lg shadow p-6 transition-colors duration-300">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Appearance
                                </h2>
                                <div className="space-y-6">
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a0f2e] rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {isDark ? (
                                                <Moon className="h-6 w-6 text-[#f5a623]" />
                                            ) : (
                                                <Sun className="h-6 w-6 text-[#f5a623]" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    Dark Mode
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {isDark ? 'Dark theme is enabled' : 'Light theme is enabled'}
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isDark}
                                                onChange={toggleDarkMode}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f5a623]/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f5a623]"></div>
                                        </label>
                                    </div>

                                    {/* Theme Preview */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Theme Preview
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    !isDark
                                                        ? 'border-[#f5a623] bg-white'
                                                        : 'border-gray-200 dark:border-[#4a1a6b] bg-gray-50 dark:bg-[#1a0f2e]'
                                                }`}
                                                onClick={() => {
                                                    if (isDark) toggleDarkMode();
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sun className="h-4 w-4 text-gray-600" />
                                                    <span className="text-sm font-medium text-gray-900">Light</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded mb-1"></div>
                                                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                                            </div>
                                            <div
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    isDark
                                                        ? 'border-[#f5a623] bg-[#2d1b4e]'
                                                        : 'border-gray-200 dark:border-[#4a1a6b] bg-gray-50 dark:bg-[#1a0f2e]'
                                                }`}
                                                onClick={() => {
                                                    if (!isDark) toggleDarkMode();
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Moon className="h-4 w-4 text-[#f5a623]" />
                                                    <span className="text-sm font-medium text-white">Dark</span>
                                                </div>
                                                <div className="h-2 bg-[#4a1a6b] rounded mb-1"></div>
                                                <div className="h-2 bg-[#3d2b5e] rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={() => handleSave('Appearance')}
                                            className="flex items-center gap-2 px-6 py-2 bg-[#f5a623] text-white rounded-lg hover:bg-[#e09520] transition"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}