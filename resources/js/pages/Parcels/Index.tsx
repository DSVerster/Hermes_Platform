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

    // Form for Creating and Updating
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

    const openCreate = () => {
        reset();
        clearErrors();
        setCreateOpen(true);
    };

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
        post(route('parcels.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                reset();
            },
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingParcel) return;
        put(route('parcels.update', editingParcel.parcel_id), {
            onSuccess: () => {
                setEditOpen(false);
                setEditingParcel(null);
                reset();
            },
        });
    };

    const handleDelete = (parcelId: number, trackingNumber: string) => {
        if (confirm(`Are you sure you want to delete parcel ${trackingNumber}?`)) {
            destroy(route('parcels.destroy', parcelId));
        }
    };

    const pendingCount = parcels.filter(p => p.status === 'received' || p.status === 'ready_for_collection' || p.status === 'pending').length;
    const collectedCount = parcels.filter(p => p.status === 'collected' || p.status === 'delivered').length;

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Parcels Overview</h2>
                        <p className="text-gray-500 mt-1">Manage and track all parcel deliveries.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search parcels..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]"
                                />
                            </div>
                            <Button type="submit" variant="outline" className="text-xs">Search</Button>
                        </form>

                        <Button onClick={openCreate} className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                            <Plus className="h-4 w-4 mr-2" />
                            New Parcel
                        </Button>
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
                                            <p className="font-semibold text-sm text-gray-900">{parcel.tracking_number}</p>
                                            <p className="text-xs text-gray-500">
                                                Received: {parcel.date_received ? new Date(parcel.date_received).toLocaleDateString() : 'N/A'} {parcel.recipient_name ? `• ${parcel.recipient_name}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {parcel.status ? parcel.status.replace(/_/g, ' ') : 'Unknown'}
                                        </span>

                                        {/* View Details */}
                                        <Link href={route('parcels.show', parcel.parcel_id)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="View Details">
                                            <Eye className="h-4 w-4" />
                                        </Link>

                                        {/* Edit Button */}
                                        <button onClick={() => openEdit(parcel)} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" title="Edit Parcel">
                                            <Pencil className="h-4 w-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button onClick={() => handleDelete(parcel.parcel_id, parcel.tracking_number)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" title="Delete Parcel">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
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

                                {/* CREATE MODAL */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <DialogHeader>
                            <DialogTitle className="text-[#2d1b4e] text-lg font-bold">Create New Parcel</DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm">
                                Add a new parcel tracking record to the local server system.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Tracking Number</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                    value={data.tracking_number} 
                                    onChange={e => setData('tracking_number', e.target.value)} 
                                    required 
                                />
                                {errors.tracking_number && <p className="text-red-500 text-xs mt-1">{errors.tracking_number}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        value={data.recipient_name} 
                                        onChange={e => setData('recipient_name', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient Phone</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        value={data.recipient_phone} 
                                        onChange={e => setData('recipient_phone', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Parcel Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        placeholder="Box, Envelope..." 
                                        value={data.parcel_type} 
                                        onChange={e => setData('parcel_type', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Storage Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        placeholder="Shelf A1" 
                                        value={data.storage_location} 
                                        onChange={e => setData('storage_location', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Courier</label>
                                    <select 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        value={data.courier_id} 
                                        onChange={e => setData('courier_id', e.target.value)} 
                                        required
                                    >
                                        {couriers.map(c => (
                                            <option key={c.courier_id} value={c.courier_id} className="bg-white text-black">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Collection Fee ($)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" 
                                        value={data.collection_fee} 
                                        onChange={e => setData('collection_fee', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="bg-black text-white hover:bg-neutral-800 rounded-lg px-6 font-medium text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-[#e85d04] hover:bg-[#d45404] text-white rounded-lg px-6 font-semibold text-xs shadow-md shadow-orange-500/20">
                                    {processing ? 'Saving...' : 'Save Parcel'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* EDIT MODAL */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-[#2d1b4e] text-lg font-bold">Edit Parcel</DialogTitle>
                            <DialogDescription>
                                Update parcel tracking record details.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Tracking Number</label>
                                <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.tracking_number} onChange={e => setData('tracking_number', e.target.value)} required />
                                {errors.tracking_number && <p className="text-red-500 text-xs mt-1">{errors.tracking_number}</p>}
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
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.parcel_type} onChange={e => setData('parcel_type', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Storage Location</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={data.storage_location} onChange={e => setData('storage_location', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
                                    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={data.status} onChange={e => setData('status', e.target.value)}>
                                        <option value="received">Received</option>
                                        <option value="ready_for_collection">Ready For Collection</option>
                                        <option value="collected">Collected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Courier</label>
                                    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={data.courier_id} onChange={e => setData('courier_id', e.target.value)} required>
                                        {couriers.map(c => (
                                            <option key={c.courier_id} value={c.courier_id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Fee ($)</label>
                                    <input type="number" step="0.01" className="w-full p-2 border rounded-lg text-sm" value={data.collection_fee} onChange={e => setData('collection_fee', e.target.value)} required />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing} className="bg-[#e85d04] hover:bg-[#d45404] text-white">
                                    {processing ? 'Updating...' : 'Update Changes'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}