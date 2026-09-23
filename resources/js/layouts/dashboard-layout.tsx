import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Truck,
    Bell,
    Users,
    LogOut,
    Menu,
    Settings,
    Moon,
    Sun,
} from 'lucide-react';
import { useState, PropsWithChildren, useEffect } from 'react';
import { type SharedData } from '@/types';

interface DashboardLayoutProps {
    title: string;
}

interface UserWithRole {
    staff_id?: number;
    name?: string;
    surname?: string;
    email?: string;
    email_account?: string;
    role?: string;
}

export default function DashboardLayout({
    children,
    title,
}: PropsWithChildren<DashboardLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user as UserWithRole | undefined;

    // Dark Mode State
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // Apply dark mode class to HTML tag on load and change
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // Main Navigation Items
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Parcels', href: '/parcels', icon: Package },
        { name: 'Couriers', href: '/couriers', icon: Truck },
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Financial Reports', href: '/financial-reports', icon: LayoutDashboard }, // Reusing icon if BarChart3 isn't imported
        { name: 'Staff', href: '/staff', icon: Users, adminOnly: true },
    ];

    // Bottom Navigation Items (Settings)
    const bottomNavItems = [
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8f6fb] dark:bg-[#120b1c] transition-colors duration-300">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64
                    bg-gradient-to-b from-[#2d1b4e] to-[#4a1a6b]
                    dark:from-[#150d24] dark:to-[#231440]
                    transform transition-transform duration-300
                    lg:transform-none flex flex-col
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10 ring-2 ring-[#f5a623]/60 flex-shrink-0">
                        <img
                            src="/images/LOGO.png"
                            alt="Hermes"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide">Hermes</h1>
                        <p className="text-xs text-[#f5a623] font-medium">Platform</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="px-4 py-6 space-y-1 flex-1 overflow-y-auto">
                    {navItems
                        .filter(
                            (item) =>
                                !item.adminOnly ||
                                user?.email === 'admin@gmail.com' ||
                                user?.email_account === 'admin@gmail.com'
                        )
                        .map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="h-5 w-5 group-hover:text-[#f5a623] transition-colors" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        ))}
                </nav>

                {/* Bottom Section: Settings & User */}
                <div className="mt-auto border-t border-white/10 bg-black/20">
                    {/* Settings Link */}
                    <div className="px-4 py-2">
                        {bottomNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="h-5 w-5 group-hover:text-[#f5a623] transition-colors" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="h-9 w-9 rounded-full bg-[#f5a623] flex items-center justify-center text-[#2d1b4e] font-bold text-sm flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-white/50 truncate">
                                    {user?.email_account || user?.email || ''}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium">Log out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-colors duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1e1333]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#2d1b4e] px-6 py-4 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-[#2d1b4e] dark:text-white transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-bold text-[#2d1b4e] dark:text-white transition-colors">
                                {title}
                            </h1>
                        </div>
                        
                        {/* Dark Mode Toggle in Header */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#2d1b4e] text-[#2d1b4e] dark:text-[#f5a623] hover:bg-gray-200 dark:hover:bg-[#3d2b5e] transition-all"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}