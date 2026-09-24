import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Package,
    Plus,
    Eye,
    Clock,
    CheckCircle,
    Truck,
    Box,
    AlertCircle,
    Pencil,
    Trash2,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard-layout';
import React, { useState } from 'react';

type Parcel = {
    parcel_id: number;
    tracking_number: string;
    status: string;
    date_received: string;
    recipient_name: string;
    recipient_phone: string;
    parcel_type: string;
    storage_location: string;
    courier_id: number;
    courier_service?: string;
    collection_fee?: number;
}

type Courier = {
    courier_id: number;
    name: string;
}

type Props = {
    title: string;
    parcels: Parcel[];
    couriers: Courier[];
    filters: { search?: string };
}

export default function Index({ title, parcels, couriers = [], filters }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
    const [search, setSearch] = useState(filters?.search || '');

    const statusColors: Record<string, string> = {
        received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        ready_for_collection: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        collected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        delivered: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    };

    const statusIcons: Record<string, typeof Package> = {
        received: Box,
        ready_for_collection: Truck,
        collected: CheckCircle,
        delivered: Package,
        pending: AlertCircle,
    };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        tracking_number: '',
        recipient_name: '',
        recipient_phone: '',
        parcel_type: '',
        storage_location: '',
        status: 'received',
        courier_id: couriers[0]?.courier_id ? couriers[0].courier_id.toString() : '1',
        courier_service: '',
        collection_fee: '0.00',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('parcels.index'), { search }, { preserveState: true, replace: true });
    };

    const openCreate = () => { reset(); clearErrors(); setCreateOpen(true); };
    
    const openEdit = (parcel: Parcel) => {
        clearErrors();
        setEditingParcel(parcel);
        setData({
            tracking_number: parcel.tracking_number,
            recipient_name: parcel.recipient_name || '',
            recipient_phone: parcel.recipient_phone || '',
            parcel_type: parcel.parcel_type || '',
            storage_location: parcel.storage_location || '',
            status: parcel.status || 'received',
            courier_id: parcel.courier_id ? parcel.courier_id.toString() : '1',
            courier_service: parcel.courier_service || '',
            collection_fee: parcel.collection_fee ? parcel.collection_fee.toString() : '0.00',
        });
        setEditOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;
        post(route('parcels.store'), {
            preserveState: true, preserveScroll: true,
            onSuccess: () => { setCreateOpen(false); reset(); },
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingParcel) return;
        put(route('parcels.update', editingParcel.parcel_id), {
            onSuccess: () => { setEditOpen(false); setEditingParcel(null); reset(); },
        });
    };

    const handleDelete = (parcelId: number, trackingNumber: string) => {
        if (confirm(`Are you sure you want to delete parcel ${trackingNumber}?`)) {
            destroy(route('parcels.destroy', parcelId));
        }
    };

    const pendingCount = parcels.filter(p => ['received', 'ready_for_collection', 'pending'].includes(p.status)).length;
    const collectedCount = parcels.filter(p => ['collected', 'delivered'].includes(p.status)).length;

    // Common input classes for dark mode
    const inputClass = "w-full p-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg text-sm bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]";
    const labelClass = "block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1";

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e] dark:text-white">Parcels Overview</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all parcel deliveries.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Search parcels..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg text-sm bg-white dark:bg-[#1a0f2e] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]"
                                />
                            </div>
                            <Button type="submit" variant="outline" className="text-xs border-gray-300 dark:border-[#4a1a6b] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d1b4e]">Search</Button>
                        </form>
                        <Button onClick={openCreate} className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                            <Plus className="h-4 w-4 mr-2" /> New Parcel
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-[#2d1b4e]/10 dark:bg-[#4a1a6b]/30 flex items-center justify-center">
                                <Package className="h-6 w-6 text-[#2d1b4e] dark:text-[#f5a623]" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">All Time</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{parcels.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Parcels</p>
                    </div>
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{pendingCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Awaiting Collection</p>
                    </div>
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e] hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Completed</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{collectedCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Collected</p>
                    </div>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-[#1e1333] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2d1b4e] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-[#2d1b4e] flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d1b4e] dark:text-white">All Parcels</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#2d1b4e] text-gray-600 dark:text-gray-300">
                            {parcels.length} records
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#2d1b4e]">
                        {parcels.map((parcel) => {
                            const StatusIcon = statusIcons[parcel.status] || Package;
                            return (
                                <div key={parcel.parcel_id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2d1b4e]/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            <StatusIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{parcel.tracking_number}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Received: {parcel.date_received ? new Date(parcel.date_received).toLocaleDateString() : 'N/A'} {parcel.recipient_name ? `• ${parcel.recipient_name}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {parcel.status ? parcel.status.replace(/_/g, ' ') : 'Unknown'}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <Link href={route('parcels.show', parcel.parcel_id)} className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors" title="View Details">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button onClick={() => openEdit(parcel)} className="p-2 text-gray-600 hover:text-amber-600 bg-gray-50 dark:bg-[#2d1b4e] hover:bg-gray-100 dark:hover:bg-[#3d2b5e] rounded-lg transition-colors" title="Edit Parcel">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(parcel.parcel_id, parcel.tracking_number)} className="p-2 text-gray-600 hover:text-red-600 bg-gray-50 dark:bg-[#2d1b4e] hover:bg-gray-100 dark:hover:bg-[#3d2b5e] rounded-lg transition-colors" title="Delete Parcel">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {parcels.length === 0 && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                No parcels found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) reset(); }}>
                <DialogContent className="bg-white dark:bg-[#1e1333] text-gray-900 dark:text-white border-gray-200 dark:border-[#4a1a6b]">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">Create New Parcel</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">Add a new parcel tracking record.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div><label className={labelClass}>Tracking Number</label><input type="text" className={inputClass} value={data.tracking_number} onChange={e => setData('tracking_number', e.target.value)} required /></div>
                        <div><label className={labelClass}>Recipient Name</label><input type="text" className={inputClass} value={data.recipient_name} onChange={e => setData('recipient_name', e.target.value)} required /></div>
                        <div><label className={labelClass}>Recipient Phone</label><input type="text" className={inputClass} value={data.recipient_phone} onChange={e => setData('recipient_phone', e.target.value)} required /></div>
                        <div><label className={labelClass}>Parcel Type</label><input type="text" className={inputClass} placeholder="Box, Envelope..." value={data.parcel_type} onChange={e => setData('parcel_type', e.target.value)} required /></div>
                        <div><label className={labelClass}>Storage Location</label><input type="text" className={inputClass} placeholder="Shelf A1" value={data.storage_location} onChange={e => setData('storage_location', e.target.value)} required /></div>
                        <div><label className={labelClass}>Courier</label>
                            <select className={inputClass} value={data.courier_id} onChange={e => setData('courier_id', e.target.value)} required>
                                {couriers.map(c => (<option key={c.courier_id} value={c.courier_id} className="text-gray-900 dark:text-white">{c.name}</option>))}
                            </select>
                        </div>
                        <div><label className={labelClass}>Collection Fee (R)</label><input type="number" step="0.01" className={inputClass} value={data.collection_fee} onChange={e => setData('collection_fee', e.target.value)} required /></div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); reset(); }} className="rounded-lg px-6 font-medium text-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-[#2d1b4e] border-gray-300 dark:border-[#4a1a6b] hover:bg-gray-100 dark:hover:bg-[#3d2b5e]">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-[#e85d04] hover:bg-[#d45404] text-white">Save Parcel</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingParcel(null); reset(); } }}>
                <DialogContent className="bg-white dark:bg-[#1e1333] text-gray-900 dark:text-white border-gray-200 dark:border-[#4a1a6b]">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">Edit Parcel</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">Update parcel details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        <div><label className={labelClass}>Tracking Number</label><input type="text" className={inputClass} value={data.tracking_number} onChange={e => setData('tracking_number', e.target.value)} required /></div>
                        <div><label className={labelClass}>Recipient Name</label><input type="text" className={inputClass} value={data.recipient_name} onChange={e => setData('recipient_name', e.target.value)} required /></div>
                        <div><label className={labelClass}>Recipient Phone</label><input type="text" className={inputClass} value={data.recipient_phone} onChange={e => setData('recipient_phone', e.target.value)} required /></div>
                        <div><label className={labelClass}>Parcel Type</label><input type="text" className={inputClass} value={data.parcel_type} onChange={e => setData('parcel_type', e.target.value)} required /></div>
                        <div><label className={labelClass}>Storage Location</label><input type="text" className={inputClass} value={data.storage_location} onChange={e => setData('storage_location', e.target.value)} required /></div>
                        <div><label className={labelClass}>Status</label>
                            <select className={inputClass} value={data.status} onChange={e => setData('status', e.target.value)}>
                                <option value="received" className="dark:bg-[#1e1333]">Received</option>
                                <option value="ready_for_collection" className="dark:bg-[#1e1333]">Ready For Collection</option>
                                <option value="collected" className="dark:bg-[#1e1333]">Collected</option>
                                <option value="delivered" className="dark:bg-[#1e1333]">Delivered</option>
                                <option value="pending" className="dark:bg-[#1e1333]">Pending</option>
                            </select>
                        </div>
                        <div><label className={labelClass}>Courier</label>
                            <select className={inputClass} value={data.courier_id} onChange={e => setData('courier_id', e.target.value)} required>
                                {couriers.map(c => (<option key={c.courier_id} value={c.courier_id} className="dark:bg-[#1e1333]">{c.name}</option>))}
                            </select>
                        </div>
                        <div><label className={labelClass}>Fee (R)</label><input type="number" step="0.01" className={inputClass} value={data.collection_fee} onChange={e => setData('collection_fee', e.target.value)} required /></div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditingParcel(null); reset(); }} className="text-gray-700 dark:text-gray-200 bg-white dark:bg-[#2d1b4e] border-gray-300 dark:border-[#4a1a6b] hover:bg-gray-100 dark:hover:bg-[#3d2b5e]">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-[#e85d04] hover:bg-[#d45404] text-white">Update Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}