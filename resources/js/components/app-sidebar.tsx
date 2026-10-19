import { AppLogo } from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LogOut, Settings } from 'lucide-react';
import { Link } from './text-link';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { router } from '@inertiajs/react';

const mainNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
    { title: 'Parcels', href: '/parcels', icon: 'package' },
    { title: 'Couriers', href: '/couriers', icon: 'truck' },
    { title: 'Notifications', href: '/notifications', icon: 'bell' },
    { title: 'Financial Reports', href: '/financial-reports', icon: 'bar-chart-3' },
    { title: 'Staff', href: '/staff', icon: 'users' },
];

export function AppSidebar() {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* 1. SETTINGS */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            <Link href={route('profile.edit')} prefetch onClick={cleanup}>
                                <Settings className="h-5 w-5" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* 2. USER PROFILE */}
                <NavUser />

                {/* 3. LOG OUT */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="text-neutral-600 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
                        >
                            <Link method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                <LogOut className="h-5 w-5" />
                                <span>Log out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}