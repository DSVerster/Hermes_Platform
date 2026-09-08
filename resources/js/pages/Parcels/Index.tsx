import { Head, Link } from '@inertiajs/react';
import { 
    Package, 
    Plus,
    Eye,
    Clock,
    CheckCircle,
    Truck,
    Box,
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
    id: number;
    tracking_number: string;
    status: 'received' | 'ready_for_collection' | 'collected';
    received_at: string;
}

type Props = {
    title: string;
    parcels: Parcel[];
}

export default function Index({ title, parcels }: Props) {
    const statusColors: Record<string, string> = {
        received: 'bg-blue-100 text-blue-700',
        ready_for_collection: 'bg-amber-100 text-amber-700',
        collected: 'bg-green-100 text-green-700',
        delivered: 'bg-purple-100 text-purple-700',
        pending: 'bg-orange-100 text-orange-700',
    };

    const statusIcons: Record<string, typeof Package> = {
        received: Box,
        ready_for_collection: Truck,
        collected: CheckCircle,
        delivered: Package,
        pending: AlertCircle,
    };

    const pendingCount = parcels.filter(p => p.status === 'received').length;
    const collectedCount = parcels.filter(p => p.status === 'collected').length;

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header - matches Dashboard style */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Parcels Overview</h2>
                        <p className="text-gray-500 mt-1">Manage and track all parcel deliveries.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* New Parcel Button */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Parcel
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-[#2d1b4e]">Create New Parcel</DialogTitle>
                                    <DialogDescription>
                                        Add a new parcel to the system. Fill in the tracking details below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center gap-4 p-4 bg-[#f8f6fb] rounded-xl">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e85d04] flex items-center justify-center">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2d1b4e]">New Parcel Entry</p>
                                        <p className="text-sm text-gray-500">Form will go here</p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Required Dialog */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-[#2d1b4e]/20 text-[#2d1b4e] hover:bg-[#2d1b4e]/5">
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
                                        <p className="font-semibold text-[#2d1b4e]">Hermes Parcels</p>
                                        <p className="text-sm text-gray-500">Managing parcels efficiently</p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Grid - matching Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-[#2d1b4e]/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-[#2d1b4e]" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">All Time</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{parcels.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Total Parcels</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-amber-600">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{pendingCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Awaiting Collection</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600">Completed</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e]">{collectedCount}</p>
                        <p className="text-sm text-gray-500 mt-1">Collected</p>
                    </div>
                </div>

                {/* Parcels List - matching Recent Parcels style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#2d1b4e]">All Parcels</h3>
                            <span className="text-sm text-gray-500">{parcels.length} records</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {parcels.map((parcel) => {
                                const StatusIcon = statusIcons[parcel.status] || Package;
                                return (
                                    <div key={parcel.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            <StatusIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[#2d1b4e] truncate">{parcel.tracking_number}</p>
                                            <p className="text-sm text-gray-500">
                                                Received: {new Date(parcel.received_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {parcel.status.replace('_', ' ')}
                                            </span>
                                            <Link href={`/parcels/${parcel.id}`}>
                                                <Button variant="ghost" size="sm" className="text-[#e85d04] hover:text-[#f5a623] hover:bg-orange-50">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {parcels.length === 0 && (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No parcels found. Create your first parcel to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}