import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Camera, CheckCircle, Clock, Eye, Package, Pencil, Plus, ScanLine, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
};

type Courier = {
    courier_id: number;
    name: string;
};

type Props = {
    title: string;
    parcels: Parcel[];
    couriers: Courier[];
    filters: { search?: string };
};

export default function Index({ title, parcels, couriers = [], filters }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
    const [search, setSearch] = useState(filters?.search || '');

    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<string>('');
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerContainerId = 'barcode-scanner-region';

    const statusColors: Record<string, string> = {
        received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        collected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    };

    const statusIcons: Record<string, typeof Package> = {
        received: Box,
        collected: CheckCircle,
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        clearErrors,
    } = useForm({
        tracking_number: '',
        recipient_name: '',
        recipient_phone: '+27 ',
        parcel_type: '',
        storage_location: '',
        status: 'received',
        courier_id: couriers[0]?.courier_id ? couriers[0].courier_id.toString() : '1',
        courier_service: '',
        collection_fee: '10.00',
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
            recipient_phone: parcel.recipient_phone || '+27 ',
            parcel_type: parcel.parcel_type || '',
            storage_location: parcel.storage_location || '',
            status: parcel.status || 'received',
            courier_id: parcel.courier_id ? parcel.courier_id.toString() : '1',
            courier_service: parcel.courier_service || '',
            collection_fee: parcel.collection_fee ? parcel.collection_fee.toString() : '10.00',
        });

        setEditOpen(true);
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (error: unknown) {
                console.error('Error stopping scanner:', error);
            }

            scannerRef.current = null;
        }

        setIsScanning(false);
        setScanError(null);
        setScanStatus('');
    };

    const startScanner = async () => {
        setScanError(null);
        setScanStatus('Initializing camera...');
        setIsScanning(true);

        await new Promise((r) => setTimeout(r, 100));

        try {
            const scanner = new Html5Qrcode(scannerContainerId);

            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: {
                        width: 280,
                        height: 180,
                    },
                },
                async (decodedText: string) => {
                    await stopScanner();
                    await handleBarcodeScanned(decodedText);
                },
                () => {},
            );

            setScanStatus('Point camera at barcode...');
        } catch (err: unknown) {
            setScanError(err instanceof Error ? err.message : 'Could not access camera.');
            setIsScanning(false);
        }
    };

    const handleBarcodeScanned = async (trackingNumber: string) => {
        setScanStatus(`Scanned: ${trackingNumber}. Looking up...`);

        try {
            const response = await fetch(route('parcels.api-lookup') + '?tracking_number=' + encodeURIComponent(trackingNumber));

            if (!response.ok) {
                throw new Error('Lookup failed');
            }

            const result = await response.json();

            if (result.found && result.parcel) {
                setScanStatus('Parcel found! Opening edit form...');
                openEdit(result.parcel);
            } else {
                reset();
                clearErrors();
                setData('tracking_number', trackingNumber);
                setCreateOpen(true);
            }
        } catch {
            reset();
            clearErrors();
            setData('tracking_number', trackingNumber);
            setCreateOpen(true);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (processing) return;

        post(route('parcels.store'), {
            preserveState: true,
            preserveScroll: true,

            onSuccess: () => {
                setCreateOpen(false);
                reset();
                stopScanner();
            },

            onFinish: () => clearErrors(),
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
        if (confirm(`Delete parcel ${trackingNumber}?`)) {
            destroy(route('parcels.destroy', parcelId));
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        if (!createOpen && !editOpen) {
            stopScanner();
        }
    }, [createOpen, editOpen]);

    const receivedCount = parcels.filter((p) => p.status === 'received').length;

    const collectedCount = parcels.filter((p) => p.status === 'collected').length;

    const inputClass =
        'w-full p-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg text-sm bg-white dark:bg-[#1a0f2e] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]';

    const labelClass = 'block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1';

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e] dark:text-white">Parcels Overview</h2>

                        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and track all parcel deliveries.</p>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />

                                <input
                                    type="text"
                                    placeholder="Search parcels..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm text-black focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 focus:outline-none dark:border-[#4a1a6b] dark:bg-[#1a0f2e] dark:text-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="outline"
                                className="border-gray-300 text-xs text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:text-gray-200 dark:hover:bg-[#2d1b4e]"
                            >
                                Search
                            </Button>
                        </form>

                        <Button
                            onClick={openCreate}
                            className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] text-white shadow-lg shadow-orange-500/25 hover:from-[#e09520] hover:to-[#d45404]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Parcel
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d1b4e]/10 dark:bg-[#4a1a6b]/30">
                                <Package className="h-6 w-6 text-[#2d1b4e] dark:text-[#f5a623]" />
                            </div>

                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">All Time</span>
                        </div>

                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{parcels.length}</p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Parcels</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>

                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Received</span>
                        </div>

                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{receivedCount}</p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Awaiting Collection</p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>

                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Completed</span>
                        </div>

                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{collectedCount}</p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Collected</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                    <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-[#2d1b4e]">
                        <h3 className="text-lg font-bold text-[#2d1b4e] dark:text-white">All Parcels</h3>

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-[#2d1b4e] dark:text-gray-300">
                            {parcels.length} records
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-[#2d1b4e]">
                        {parcels.map((parcel) => {
                            const StatusIcon = statusIcons[parcel.status] || Package;

                            return (
                                <div
                                    key={parcel.parcel_id}
                                    className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 sm:px-6 dark:hover:bg-[#2d1b4e]/50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                statusColors[parcel.status] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            <StatusIcon className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{parcel.tracking_number}</p>

                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Received: {parcel.date_received ? new Date(parcel.date_received).toLocaleDateString() : 'N/A'}{' '}
                                                {parcel.recipient_name ? `• ${parcel.recipient_name}` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                statusColors[parcel.status] || 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {parcel.status ? parcel.status.replace(/_/g, ' ') : 'Unknown'}
                                        </span>

                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={route('parcels.show', parcel.parcel_id)}
                                                className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>

                                            <button
                                                onClick={() => openEdit(parcel)}
                                                className="rounded-lg bg-gray-50 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-amber-600 dark:bg-[#2d1b4e] dark:hover:bg-[#3d2b5e]"
                                                title="Edit Parcel"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(parcel.parcel_id, parcel.tracking_number)}
                                                className="rounded-lg bg-gray-50 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:bg-[#2d1b4e] dark:hover:bg-[#3d2b5e]"
                                                title="Delete Parcel"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {parcels.length === 0 && <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">No parcels found.</div>}
                    </div>
                </div>
            </div>

            {/* CREATE MODAL */}

            <Dialog
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);

                    if (!open) {
                        reset();
                        stopScanner();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white text-gray-900 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Parcel</DialogTitle>

                        <DialogDescription className="text-gray-600 dark:text-gray-400">Add a new parcel tracking record.</DialogDescription>
                    </DialogHeader>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#4a1a6b] dark:bg-[#120b1c]">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScanLine className="h-5 w-5 text-[#f5a623]" />

                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Barcode Scanner</span>
                            </div>

                            {isScanning && (
                                <button onClick={stopScanner} className="rounded p-1 hover:bg-gray-200 dark:hover:bg-[#2d1b4e]">
                                    <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            )}
                        </div>

                        {isScanning ? (
                            <div>
                                <div id={scannerContainerId} className="w-full overflow-hidden rounded-lg bg-black" style={{ minHeight: '200px' }} />

                                {scanStatus && <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">{scanStatus}</p>}
                            </div>
                        ) : (
                            <div className="py-2 text-center">
                                {scanError ? (
                                    <p className="mb-2 text-xs text-red-500">{scanError}</p>
                                ) : (
                                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                        Scan a barcode to auto-fill or open an existing parcel.
                                    </p>
                                )}

                                <button
                                    onClick={startScanner}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#2d1b4e] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-[#4a1a6b]"
                                >
                                    <Camera className="h-4 w-4" />
                                    Start Scanner
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Tracking Number</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.tracking_number}
                                onChange={(e) => setData('tracking_number', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Recipient Name</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.recipient_name}
                                onChange={(e) => setData('recipient_name', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Recipient Phone</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.recipient_phone}
                                onChange={(e) => setData('recipient_phone', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Parcel Type</label>

                            <select className={inputClass} value={data.parcel_type} onChange={(e) => setData('parcel_type', e.target.value)} required>
                                <option value="" disabled>
                                    Select a parcel type...
                                </option>
                                <option value="Box">Box</option>
                                <option value="Envelope">Envelope</option>
                                <option value="Flyer">Flyer / Bag</option>
                                <option value="Pallet">Pallet</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Storage Location</label>

                            <select
                                className={inputClass}
                                value={data.storage_location}
                                onChange={(e) => setData('storage_location', e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a location...
                                </option>
                                <option value="Shelf A1">Shelf A1</option>
                                <option value="Shelf A2">Shelf A2</option>
                                <option value="Shelf B1">Shelf B1</option>
                                <option value="Shelf B2">Shelf B2</option>
                                <option value="Floor Area">Floor Area</option>
                                <option value="Secure Cage">Secure Cage</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Courier</label>

                            <select className={inputClass} value={data.courier_id} onChange={(e) => setData('courier_id', e.target.value)} required>
                                {couriers.map((c) => (
                                    <option key={c.courier_id} value={c.courier_id} className="text-gray-900 dark:text-white">
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setCreateOpen(false);
                                    reset();
                                    stopScanner();
                                }}
                                className="rounded-lg border-gray-300 bg-white px-6 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:bg-[#2d1b4e] dark:text-gray-200 dark:hover:bg-[#3d2b5e]"
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={processing} className="bg-[#e85d04] text-white hover:bg-[#d45404]">
                                {processing ? 'Saving...' : 'Save Parcel'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}

            <Dialog
                open={editOpen}
                onOpenChange={(open) => {
                    setEditOpen(open);

                    if (!open) {
                        setEditingParcel(null);
                        reset();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white text-gray-900 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Edit Parcel</DialogTitle>

                        <DialogDescription className="text-gray-600 dark:text-gray-400">Update parcel details.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Tracking Number</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.tracking_number}
                                onChange={(e) => setData('tracking_number', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Recipient Name</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.recipient_name}
                                onChange={(e) => setData('recipient_name', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Recipient Phone</label>

                            <input
                                type="text"
                                className={inputClass}
                                value={data.recipient_phone}
                                onChange={(e) => setData('recipient_phone', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Parcel Type</label>

                            <select className={inputClass} value={data.parcel_type} onChange={(e) => setData('parcel_type', e.target.value)} required>
                                <option value="" disabled>
                                    Select a parcel type...
                                </option>
                                <option value="Box">Box</option>
                                <option value="Envelope">Envelope</option>
                                <option value="Flyer">Flyer / Bag</option>
                                <option value="Pallet">Pallet</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Storage Location</label>

                            <select
                                className={inputClass}
                                value={data.storage_location}
                                onChange={(e) => setData('storage_location', e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a location...
                                </option>
                                <option value="Shelf A1">Shelf A1</option>
                                <option value="Shelf A2">Shelf A2</option>
                                <option value="Shelf B1">Shelf B1</option>
                                <option value="Shelf B2">Shelf B2</option>
                                <option value="Floor Area">Floor Area</option>
                                <option value="Secure Cage">Secure Cage</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Status</label>

                            <select className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                <option value="received" className="dark:bg-[#1e1333]">
                                    Received
                                </option>

                                <option value="collected" className="dark:bg-[#1e1333]">
                                    Collected
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Courier</label>

                            <select className={inputClass} value={data.courier_id} onChange={(e) => setData('courier_id', e.target.value)} required>
                                {couriers.map((c) => (
                                    <option key={c.courier_id} value={c.courier_id} className="dark:bg-[#1e1333]">
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditOpen(false);
                                    setEditingParcel(null);
                                    reset();
                                }}
                                className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:bg-[#2d1b4e] dark:text-gray-200 dark:hover:bg-[#3d2b5e]"
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={processing} className="bg-[#e85d04] text-white hover:bg-[#d45404]">
                                {processing ? 'Updating...' : 'Update Changes'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
