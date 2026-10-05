import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Building2, Mail, MapPin, Moon, Package, Palette, Phone, Save, Sun, User } from 'lucide-react';
import { useState, FormEventHandler } from 'react';
import { Transition } from '@headlessui/react';

type Tab = 'profile' | 'application' | 'parcels' | 'appearance';

interface User {
    staff_id: number;
    name: string;
    surname: string;
    email_account: string;
    role: string;
}

interface Settings {
    [key: string]: string | null;
}

interface Props {
    user: User;
    settings: Settings;
}

export default function Index({ user, settings }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // --- PROFILE FORM ---
    const {
        data: profileData,
        setData: setProfileData,
        put: updateProfile,
        processing: profileProcessing,
        recentlySuccessful: profileRecentlySuccessful,
        errors: profileErrors,
    } = useForm({
        name: user.name || '',
        surname: user.surname || '',
        email_account: user.email_account || '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        updateProfile(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // --- APPLICATION SETTINGS FORM ---
    const {
        data: appData,
        setData: setAppData,
        put: updateApp,
        processing: appProcessing,
        recentlySuccessful: appRecentlySuccessful,
        errors: appErrors,
    } = useForm({
        companyName: settings.companyName || 'Hermes Platform',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
    });

    const submitApp: FormEventHandler = (e) => {
        e.preventDefault();
        updateApp(route('settings.application.update'), {
            preserveScroll: true,
        });
    };

    // --- PARCEL SETTINGS FORM ---
    const {
        data: parcelData,
        setData: setParcelData,
        put: updateParcel,
        processing: parcelProcessing,
        recentlySuccessful: parcelRecentlySuccessful,
        errors: parcelErrors,
    } = useForm({
        autoTrackingNumber: settings.autoTrackingNumber === '1',
        trackingPrefix: settings.trackingPrefix || 'HP-',
    });

    const submitParcel: FormEventHandler = (e) => {
        e.preventDefault();
        updateParcel(route('settings.parcel.update'), {
            preserveScroll: true,
        });
    };

    // --- APPEARANCE (Client-side only) ---
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

    const inputClass =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#f5a623] dark:border-[#4a1a6b] dark:bg-[#1a0f2e] dark:text-white';
    const labelClass = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300';
    const errorClass = 'mt-1 text-xs text-red-500';

    return (
        <DashboardLayout title="Settings">
            <Head title="Settings" />
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your application preferences and configuration.</p>
                </div>
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Sidebar Tabs */}
                    <div className="flex-shrink-0 lg:w-64">
                        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left whitespace-nowrap transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-[#2d1b4e] text-white dark:bg-[#4a1a6b]'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#2d1b4e] dark:text-gray-300 dark:hover:bg-[#3d2b5e]'
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
                        {/* --- PROFILE TAB --- */}
                        {activeTab === 'profile' && (
                            <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-[#2d1b4e]">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                                <form onSubmit={submitProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>First Name</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                className={inputClass}
                                            />
                                            {profileErrors.name && <p className={errorClass}>{profileErrors.name}</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Surname</label>
                                            <input
                                                type="text"
                                                value={profileData.surname}
                                                onChange={(e) => setProfileData('surname', e.target.value)}
                                                className={inputClass}
                                            />
                                            {profileErrors.surname && <p className={errorClass}>{profileErrors.surname}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email_account}
                                            onChange={(e) => setProfileData('email_account', e.target.value)}
                                            className={inputClass}
                                        />
                                        {profileErrors.email_account && <p className={errorClass}>{profileErrors.email_account}</p>}
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={profileProcessing}
                                            className="flex items-center gap-2 rounded-lg bg-[#f5a623] px-6 py-2 text-white transition hover:bg-[#e09520] disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                        <Transition
                                            show={profileRecentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* --- APPLICATION TAB --- */}
                        {activeTab === 'application' && (
                            <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-[#2d1b4e]">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Application Settings</h2>
                                <form onSubmit={submitApp} className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Company Name</label>
                                        <input
                                            type="text"
                                            value={appData.companyName}
                                            onChange={(e) => setAppData('companyName', e.target.value)}
                                            className={inputClass}
                                        />
                                        {appErrors.companyName && <p className={errorClass}>{appErrors.companyName}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Contact Email</label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={appData.contactEmail}
                                                onChange={(e) => setAppData('contactEmail', e.target.value)}
                                                className={`${inputClass} py-2 pl-10`}
                                            />
                                        </div>
                                        {appErrors.contactEmail && <p className={errorClass}>{appErrors.contactEmail}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Contact Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={appData.contactPhone}
                                                onChange={(e) => setAppData('contactPhone', e.target.value)}
                                                className={`${inputClass} py-2 pl-10`}
                                            />
                                        </div>
                                        {appErrors.contactPhone && <p className={errorClass}>{appErrors.contactPhone}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Business Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                            <textarea
                                                value={appData.address}
                                                onChange={(e) => setAppData('address', e.target.value)}
                                                rows={3}
                                                className={`${inputClass} py-2 pl-10`}
                                            />
                                        </div>
                                        {appErrors.address && <p className={errorClass}>{appErrors.address}</p>}
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={appProcessing}
                                            className="flex items-center gap-2 rounded-lg bg-[#f5a623] px-6 py-2 text-white transition hover:bg-[#e09520] disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                        <Transition
                                            show={appRecentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* --- PARCEL SETTINGS TAB --- */}
                        {activeTab === 'parcels' && (
                            <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-[#2d1b4e]">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Parcel Configuration</h2>
                                <form onSubmit={submitParcel} className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#1a0f2e]">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Auto-generate Tracking Numbers</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Automatically assign tracking numbers to new parcels
                                            </p>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                checked={parcelData.autoTrackingNumber}
                                                onChange={(e) => setParcelData('autoTrackingNumber', e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#f5a623] peer-focus:ring-4 peer-focus:ring-[#f5a623]/20 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                                        </label>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Tracking Number Prefix</label>
                                        <input
                                            type="text"
                                            value={parcelData.trackingPrefix}
                                            onChange={(e) => setParcelData('trackingPrefix', e.target.value)}
                                            className={inputClass}
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Prefix used for auto-generated tracking numbers (e.g., HP-12345678)
                                        </p>
                                        {parcelErrors.trackingPrefix && <p className={errorClass}>{parcelErrors.trackingPrefix}</p>}
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={parcelProcessing}
                                            className="flex items-center gap-2 rounded-lg bg-[#f5a623] px-6 py-2 text-white transition hover:bg-[#e09520] disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </button>
                                        <Transition
                                            show={parcelRecentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* --- APPEARANCE TAB --- */}
                        {activeTab === 'appearance' && (
                            <div className="rounded-lg bg-white p-6 shadow transition-colors duration-300 dark:bg-[#2d1b4e]">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                                <div className="space-y-6">
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#1a0f2e]">
                                        <div className="flex items-center gap-3">
                                            {isDark ? <Moon className="h-6 w-6 text-[#f5a623]" /> : <Sun className="h-6 w-6 text-[#f5a623]" />}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {isDark ? 'Dark theme is enabled' : 'Light theme is enabled'}
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" checked={isDark} onChange={toggleDarkMode} className="peer sr-only" />
                                            <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#f5a623] peer-focus:ring-4 peer-focus:ring-[#f5a623]/20 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                                        </label>
                                    </div>
                                    {/* Theme Preview */}
                                    <div>
                                        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Theme Preview</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                                    !isDark
                                                        ? 'border-[#f5a623] bg-white'
                                                        : 'border-gray-200 bg-gray-50 dark:border-[#4a1a6b] dark:bg-[#1a0f2e]'
                                                }`}
                                                onClick={() => {
                                                    if (isDark) toggleDarkMode();
                                                }}
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Sun className="h-4 w-4 text-gray-600" />
                                                    <span className="text-sm font-medium text-gray-900">Light</span>
                                                </div>
                                                <div className="mb-1 h-2 rounded bg-gray-200"></div>
                                                <div className="h-2 w-3/4 rounded bg-gray-100"></div>
                                            </div>
                                            <div
                                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                                                    isDark
                                                        ? 'border-[#f5a623] bg-[#2d1b4e]'
                                                        : 'border-gray-200 bg-gray-50 dark:border-[#4a1a6b] dark:bg-[#1a0f2e]'
                                                }`}
                                                onClick={() => {
                                                    if (!isDark) toggleDarkMode();
                                                }}
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Moon className="h-4 w-4 text-[#f5a623]" />
                                                    <span className="text-sm font-medium text-white">Dark</span>
                                                </div>
                                                <div className="mb-1 h-2 rounded bg-[#4a1a6b]"></div>
                                                <div className="h-2 w-3/4 rounded bg-[#3d2b5e]"></div>
                                            </div>
                                        </div>
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