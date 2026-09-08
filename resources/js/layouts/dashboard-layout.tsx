import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, Users, Settings, LogOut, Menu } from 'lucide-react';
import { useState, PropsWithChildren } from 'react';

interface DashboardLayoutProps {
    title: string;
}

export default function DashboardLayout({ children, title }: PropsWithChildren<DashboardLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = usePage().props.auth?.user;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Parcels', href: '/parcels', icon: Package },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8f6fb]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#2d1b4e] to-[#4a1a6b] 
                transform transition-transform duration-300 lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-white/10 ring-2 ring-[#f5a623]/50">
                        <img src="/images/logo.jpg" alt="Hermes" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Hermes</h1>
                        <p className="text-xs text-[#f5a623]">Platform</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                        >
                            <item.icon className="h-5 w-5 group-hover:text-[#f5a623] transition-colors" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-[#f5a623] flex items-center justify-center text-[#2d1b4e] font-bold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-white/50 truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Log out</span>
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-[#2d1b4e]"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl font-bold text-[#2d1b4e]">{title}</h1>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5a623]/10 text-[#f5a623] text-sm font-medium">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}