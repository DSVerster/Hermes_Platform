import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    TrendingUp, 
    Clock, 
    Box,
    Truck,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard-layout';

type Parcel = {
    parcel_id: number;
    tracking_label: string;
    status: string;
    recipient_name: string;
    date_received: string;
};

type Props = {
    title: string;
    stats?: {
        total_parcels: number;
        pending_parcels: number;
        ready_for_collection: number;
        collected_parcels: number;
    };
    recent_parcels?: Parcel[];
};

export default function Dashboard({ title, stats, recent_parcels }: Props) {
    const defaultStats = {
        total_parcels: 0,
        pending_parcels: 0,
        ready_for_collection: 0,
        collected_parcels: 0,
    };

    const displayStats = stats || defaultStats;
    const parcels = recent_parcels || [];

    const statusColors: Record<string, string> = {
        received: 'bg-blue-100 text-blue-700',
        ready_for_collection: 'bg-amber-100 text-amber-700',
        collected: 'bg-green-100 text-green-700',
    };

    const statusIcons: Record<string, typeof Package> = {
        received: Box,
        ready_for_collection: Truck,
        collected: CheckCircle,
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Dialog */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Dashboard Overview</h2>
                        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                                Open {title} Dialog
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#2d1b4e]">{title}</DialogTitle>
                                <DialogDescription>
                                    This dialog belongs to the {title} page. You can add more information or actions here.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center gap-4 p-4 bg-[#f8f6fb] rounded-xl">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e85d04] flex items-center justify-center">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#2d1b4e]">Hermes Dashboard</p>
                                    <p className="text-sm text-gray-500">Managing parcels efficiently</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Parcels */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-[#2d1b4e]/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-[#2d1b4e]" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{displayStats.total_parcels.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Total Parcels</p>
                    </div>

                    {/* Pending (received, awaiting processing) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Box className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{displayStats.pending_parcels}</p>
                        <p className="text-sm text-gray-500 mt-1">Received</p>
                    </div>

                    {/* Ready for Collection */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{displayStats.ready_for_collection}</p>
                        <p className="text-sm text-gray-500 mt-1">Ready for Collection</p>
                    </div>

                    {/* Collected */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{displayStats.collected_parcels.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Collected</p>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Parcels */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#2d1b4e]">Recent Parcels</h3>
                                <Link href="/parcels">
                                    <Button variant="ghost" className="text-[#e85d04] hover:text-[#f5a623] hover:bg-orange-50">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {parcels.map((parcel) => {
                                    const StatusIcon = statusIcons[parcel.status] || Package;
                                    return (
                                        <Link
                                            key={parcel.parcel_id}
                                            href={`/parcels/${parcel.parcel_id}`}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                        >
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                                <StatusIcon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#2d1b4e] truncate">{parcel.tracking_label}</p>
                                                <p className="text-sm text-gray-500">{parcel.recipient_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {parcel.status.replace('_', ' ')}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {parcel.date_received ? new Date(parcel.date_received).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}

                                {parcels.length === 0 && (
                                    <p className="text-center text-gray-500 text-sm py-8">No parcels logged yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#2d1b4e]">Quick Actions</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <Link href="/parcels" className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#f5a623]/10 to-[#e85d04]/10 hover:from-[#f5a623]/20 hover:to-[#e85d04]/20 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#f5a623] to-[#e85d04] flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-[#2d1b4e] group-hover:text-[#e85d04] transition-colors">New Parcel</p>
                                    <p className="text-xs text-gray-500">Log a parcel intake</p>
                                </div>
                            </Link>

                            <Link href="/couriers" className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#2d1b4e]/5 hover:bg-[#2d1b4e]/10 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-[#2d1b4e] flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-[#2d1b4e]">Couriers</p>
                                    <p className="text-xs text-gray-500">Manage courier records</p>
                                </div>
                            </Link>

                            <Link href="/notifications" className="w-full flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-[#2d1b4e]">Notifications</p>
                                    <p className="text-xs text-gray-500">View sent SMS log</p>
                                </div>
                            </Link>

                            <Link href="/staff" className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all group">
                                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-[#2d1b4e]">Staff</p>
                                    <p className="text-xs text-gray-500">Manage staff accounts</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}