import { Head, Link, useForm } from '@inertiajs/react';
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
import React, { useState } from 'react';

type Parcel = {
    parcel_id: number;
    tracking_label: string;
    status: string;
    date_received: string;
}

type Props = {
    title: string;
    parcels: Parcel[];
}

export default function Index({ title, parcels }: Props) {
    const [open, setOpen] = useState(false);

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

    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_label: '',
        recipient_name: '',
        recipient_phone: '',
        parcel_type: '',
        storage_location: '',
        status: 'received',
        courier_id: '1',
        staff_id: '1',
    });

    const pendingCount = parcels.filter(p => p.status === 'received').length;
    const collectedCount = parcels.filter(p => p.status === 'collected').length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/parcels', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Parcel
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-[#2d1b4e] text-lg font-bold">Create New Parcel</DialogTitle>
                                    <DialogDescription>
                                        Add a new parcel tracking record to the local server system.
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1">Tracking Label / Number</label>
                                        <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.tracking_label} onChange={e => setData('tracking_label', e.target.value)} required />
                                        {errors.tracking_label && <p className="text-red-500 text-xs mt-1">{errors.tracking_label}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient Name</label>
                                            <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.recipient_name} onChange={e => setData('recipient_name', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient Phone</label>
                                            <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.recipient_phone} onChange={e => setData('recipient_phone', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Parcel Type</label>
                                            <input type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="Box, Envelope, etc." value={data.parcel_type} onChange={e => setData('parcel_type', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 block mb-1">Storage Location</label>
                                            <input type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="Shelf A1" value={data.storage_location} onChange={e => setData('storage_location', e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={processing} className="bg-[#e85d04] hover:bg-[#d45404] text-white">
                                            {processing ? 'Saving...' : 'Save Parcel'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Matrix Grid */}
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

                {/* Parcels List Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d1b4e]">All Parcels</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                            {parcels.length} records
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {parcels.map((parcel) => {
                            const StatusIcon = statusIcons[parcel.status] || Package;
                            return (
                                <div key={parcel.parcel_id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            <StatusIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{parcel.tracking_label}</p>
                                            <p className="text-xs text-gray-500">
                                                Received: {parcel.date_received ? new Date(parcel.date_received).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {parcel.status ? parcel.status.replace('_', ' ') : 'Unknown'}
                                        </span>
                                        <Link href={`/parcels/${parcel.parcel_id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {parcels.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No parcels found. Create your first parcel to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}