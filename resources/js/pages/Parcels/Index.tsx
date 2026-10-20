import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle, Clock, Eye, Package, Pencil, Plus, ScanLine, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Parcel = {
    parcel_id: number;
    tracking_number: string;
    status: string;
    date_received: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email?: string;
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

type ParcelFormData = {
    tracking_number: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    send_email: boolean;
    parcel_type: string;
    storage_location: string;
    status: string;
    courier_id: string;
    courier_service: string;
    collection_fee: string;
};

export default function Index({ title, parcels, couriers = [], filters }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [scanOpen, setScanOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
    const [search, setSearch] = useState(filters?.search || '');

    // Scanner State
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<string>('');
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerContainerId = 'barcode-scanner-region';

    // Courier Management State
    const [courierList, setCourierList] = useState<Courier[]>(couriers);
    const [showAddCourier, setShowAddCourier] = useState(false);
    const [newCourierName, setNewCourierName] = useState('');
    const [addingCourier, setAddingCourier] = useState(false);

    const statusColors: Record<string, string> = {
        received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        collected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<ParcelFormData>({
        tracking_number: '',
        recipient_name: '',
        recipient_phone: '+27 ',
        recipient_email: '',
        send_email: false,
        parcel_type: '',
        storage_location: '',
        status: 'received',
        courier_id: couriers[0]?.courier_id ? couriers[0].courier_id.toString() : '1',
        courier_service: '',
        collection_fee: '10.00',
    });

    const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
    const inputClass =
        'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] focus:outline-none dark:border-[#4a1a6b] dark:bg-[#120b1c] dark:text-white dark:placeholder-gray-500';

    const receivedCount = parcels.filter((p) => p.status === 'received').length;
    const collectedCount = parcels.filter((p) => p.status === 'collected').length;

    const handleQuickAddCourier = async () => {
        if (!newCourierName.trim()) return;
        setAddingCourier(true);
        try {
            const res = await fetch(route('couriers.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ name: newCourierName }),
            });
            const json = await res.json();
            if (json.courier) {
                setCourierList((prev) => [...prev, json.courier]);
                setData('courier_id', json.courier.courier_id.toString());
                setShowAddCourier(false);
                setNewCourierName('');
            }
        } catch {
            // silent fail
        } finally {
            setAddingCourier(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('parcels.index'), { search }, { preserveState: true, preserveScroll: true });
    };

    const openCreate = () => {
        reset();
        clearErrors();
        setShowAddCourier(false);
        setNewCourierName('');
        setCreateOpen(true);
    };

    const openEdit = (parcel: Parcel) => {
        setEditingParcel(parcel);
        setData({
            tracking_number: parcel.tracking_number,
            recipient_name: parcel.recipient_name,
            recipient_phone: parcel.recipient_phone,
            recipient_email: parcel.recipient_email || '',
            send_email: false,
            parcel_type: parcel.parcel_type,
            storage_location: parcel.storage_location,
            status: parcel.status,
            courier_id: parcel.courier_id.toString(),
            courier_service: parcel.courier_service || '',
            collection_fee: parcel.collection_fee?.toString() || '10.00',
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
        setScanStatus('');
    };

    /**
     * FIXED: startScanner now accepts a mode parameter to determine behavior on scan
     */
    const startScanner = async (mode: 'edit' | 'create' = 'edit') => {
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
                    qrbox: { width: 280, height: 180 },
                },
                async (decodedText: string) => {
                    await stopScanner();
                    // Pass the mode through to the handler
                    await handleBarcodeScanned(decodedText, mode);
                },
                () => {},
            );

            setScanStatus('Point camera at barcode...');
        } catch (err: unknown) {
            setScanError(err instanceof Error ? err.message : 'Could not access camera.');
            setIsScanning(false);
        }
    };

    /**
     * Handles barcode scanning logic based on context.
     * @param trackingNumber The scanned barcode value
     * @param mode 'edit' -> Opens Edit Modal (for Scan Parcel button)
     *             'create' -> Fills Create Form (for Barcode Scanner inside Create Modal)
     */
    const handleBarcodeScanned = async (trackingNumber: string, mode: 'edit' | 'create' = 'edit') => {
        setScanStatus(`Scanned: ${trackingNumber}. Looking up...`);
        setScanError(null);

        try {
            let apiUrl = '';
            try {
                apiUrl = route('parcels.api-lookup');
            } catch {
                console.warn('Route helper failed, using fallback URL');
                apiUrl = '/parcels/api/lookup';
            }

            const response = await fetch(`${apiUrl}?tracking_number=${encodeURIComponent(trackingNumber)}`);

            if (response.ok) {
                const result = await response.json();

                if (result.found && result.parcel) {
                    if (mode === 'edit') {
                        // SCAN PARCEL BUTTON BEHAVIOR: Open Edit Modal
                        setScanStatus('Parcel found! Opening edit form...');
                        setScanOpen(false);
                        setTimeout(() => openEdit(result.parcel), 150);
                    } else {
                        // CREATE MODAL SCANNER BEHAVIOR: Fill Create Form
                        const p = result.parcel;
                        setData({
                            tracking_number: p.tracking_number,
                            recipient_name: p.recipient_name,
                            recipient_phone: p.recipient_phone,
                            recipient_email: p.recipient_email || '',
                            send_email: false,
                            parcel_type: p.parcel_type,
                            storage_location: p.storage_location,
                            status: p.status,
                            courier_id: p.courier_id.toString(),
                            courier_service: p.courier_service || '',
                            collection_fee: p.collection_fee?.toString() || '10.00',
                        });
                        setScanStatus('Parcel found! Details auto-filled.');
                    }
                } else {
                    // Parcel not found
                    if (mode === 'edit') {
                        setScanStatus('Parcel not found. Opening create form...');
                        reset();
                        clearErrors();
                        setData('tracking_number', trackingNumber);
                        setScanOpen(false);
                        setTimeout(() => setCreateOpen(true), 150);
                    } else {
                        // Already in create form, just fill tracking number
                        reset();
                        clearErrors();
                        setData('tracking_number', trackingNumber);
                        setScanStatus('New barcode. Tracking number filled.');
                    }
                }
            } else {
                throw new Error(`Server returned ${response.status}`);
            }
        } catch (err: unknown) {
            console.error('Barcode lookup failed:', err);

            // Fallback behavior on error
            if (mode === 'edit') {
                setScanError(`Lookup failed. Opening create form.`);
                reset();
                clearErrors();
                setData('tracking_number', trackingNumber);
                setScanOpen(false);
                setTimeout(() => setCreateOpen(true), 150);
            } else {
                setScanError(`Lookup failed. Tracking number filled.`);
                reset();
                clearErrors();
                setData('tracking_number', trackingNumber);
            }
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('parcels.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                reset();
                stopScanner();
                setShowAddCourier(false);
                setNewCourierName('');
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

    const handleDelete = (id: number, tracking: string) => {
        if (!confirm(`Are you sure you want to delete parcel ${tracking}?`)) return;
        destroy(route('parcels.destroy', id), {
            onSuccess: () => {},
        });
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e] dark:text-white">Parcels Overview</h2>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and track all parcel deliveries.</p>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:flex-initial">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search parcels..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623] focus:outline-none dark:border-[#4a1a6b] dark:bg-[#120b1c] dark:text-white dark:placeholder-gray-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                className="shrink-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:bg-[#2d1b4e] dark:text-gray-200 dark:hover:bg-[#3d2b5e]"
                            >
                                Search
                            </Button>
                        </form>

                        {/* SCAN PARCEL BUTTON -> MODE: EDIT */}
                        <Button
                            onClick={() => {
                                reset();
                                clearErrors();
                                setShowAddCourier(false);
                                setNewCourierName('');
                                setScanError(null);
                                setScanOpen(true);
                            }}
                            className="bg-gradient-to-r from-[#2d1b4e] to-[#4a1a6b] text-white shadow-lg shadow-purple-500/25 hover:from-[#1e1333] hover:to-[#3d1560]"
                        >
                            <ScanLine className="mr-2 h-4 w-4" />
                            Scan Parcel
                        </Button>

                        <Button
                            onClick={openCreate}
                            className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] text-white shadow-lg shadow-orange-500/25 hover:from-[#e09520] hover:to-[#d45404]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Parcel
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
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

                {/* Table of Parcels */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                    <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-[#2d1b4e]">
                        <h3 className="text-lg font-bold text-[#2d1b4e] dark:text-white">All Parcels</h3>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-[#2d1b4e] dark:text-gray-300">
                            {parcels.length} records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-[#1a0f2e] dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Tracking</th>
                                    <th className="px-6 py-3">Recipient</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date Received</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#4a1a6b]">
                                {parcels.map((parcel) => (
                                    <tr key={parcel.parcel_id} className="hover:bg-gray-50 dark:hover:bg-[#3d2b5e]">
                                        <td className="px-6 py-4 font-medium text-[#2d1b4e] dark:text-white">{parcel.tracking_number}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{parcel.recipient_name}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                    statusColors[parcel.status] || 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {parcel.status ? parcel.status.replace(/_/g, ' ') : 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {parcel.date_received
                                                ? (() => {
                                                      const date = new Date(parcel.date_received);
                                                      const day = String(date.getDate()).padStart(2, '0');
                                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                                      const year = date.getFullYear();
                                                      return `${day}-${month}-${year}`;
                                                  })()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
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
                                        </td>
                                    </tr>
                                ))}
                                {parcels.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No parcels found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                        setShowAddCourier(false);
                        setNewCourierName('');
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white text-gray-900 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Create New Parcel</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">Add a new parcel tracking record.</DialogDescription>
                    </DialogHeader>

                    {/* BARCODE SCANNER INSIDE CREATE MODAL -> MODE: CREATE */}
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
                                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Scan a barcode to auto-fill this form.</p>
                                )}
                                {/* FIXED: Explicitly pass 'create' mode here */}
                                <button
                                    onClick={() => startScanner('create')}
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
                            <label className={labelClass}>Recipient Email</label>
                            <input
                                id="recipient_email"
                                type="email"
                                className={inputClass}
                                value={data.recipient_email}
                                onChange={(e) => setData('recipient_email', e.target.value)}
                                placeholder="luckychairo@yahoomail.com"
                            />
                            {errors.recipient_email && <p className="mt-1 text-sm text-red-500">{errors.recipient_email}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="send_email"
                                type="checkbox"
                                checked={data.send_email}
                                onChange={(e) => setData('send_email', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="send_email" className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                Send Email Notification
                            </label>
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
                            <select
                                className={inputClass}
                                value={showAddCourier ? '__new__' : data.courier_id}
                                onChange={(e) => {
                                    if (e.target.value === '__new__') {
                                        setShowAddCourier(true);
                                    } else {
                                        setShowAddCourier(false);
                                        setData('courier_id', e.target.value);
                                    }
                                }}
                                required
                            >
                                {courierList.map((c) => (
                                    <option key={c.courier_id} value={c.courier_id} className="text-gray-900 dark:text-white">
                                        {c.name}
                                    </option>
                                ))}
                                <option value="__new__" className="text-gray-900 dark:text-white">
                                    + Add New Courier
                                </option>
                            </select>
                            {showAddCourier && (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Courier name"
                                        value={newCourierName}
                                        onChange={(e) => setNewCourierName(e.target.value)}
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleQuickAddCourier}
                                        disabled={addingCourier || !newCourierName.trim()}
                                        className="shrink-0 bg-[#2d1b4e] text-white hover:opacity-90"
                                    >
                                        {addingCourier ? '...' : 'Add'}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setCreateOpen(false);
                                    reset();
                                    stopScanner();
                                    setShowAddCourier(false);
                                    setNewCourierName('');
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
                            <label className={labelClass}>Recipient Email</label>
                            <input
                                type="email"
                                className={inputClass}
                                value={data.recipient_email}
                                onChange={(e) => setData('recipient_email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Parcel Type</label>
                            <select className={inputClass} value={data.parcel_type} onChange={(e) => setData('parcel_type', e.target.value)} required>
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
                            <select className={inputClass} value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                                <option value="received">Received</option>
                                <option value="collected">Collected</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Courier</label>
                            <select className={inputClass} value={data.courier_id} onChange={(e) => setData('courier_id', e.target.value)} required>
                                {courierList.map((c) => (
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
                                    setEditOpen(false);
                                    setEditingParcel(null);
                                    reset();
                                }}
                                className="rounded-lg border-gray-300 bg-white px-6 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:bg-[#2d1b4e] dark:text-gray-200 dark:hover:bg-[#3d2b5e]"
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

            {/* SCAN PARCEL MODAL (Standalone) */}
            <Dialog
                open={scanOpen}
                onOpenChange={(open) => {
                    setScanOpen(open);
                    if (!open) {
                        stopScanner();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white text-gray-900 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Scan Parcel</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Scan a barcode to look up and edit an existing parcel.
                        </DialogDescription>
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
                                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Scan a barcode to find and edit a parcel.</p>
                                )}
                                {/* DEFAULTS TO 'EDIT' MODE FOR STANDALONE SCANNER */}
                                <button
                                    onClick={() => startScanner('edit')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#2d1b4e] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-[#4a1a6b]"
                                >
                                    <Camera className="h-4 w-4" />
                                    Start Scanner
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setScanOpen(false);
                                stopScanner();
                            }}
                            className="rounded-lg border-gray-300 bg-white px-6 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-[#4a1a6b] dark:bg-[#2d1b4e] dark:text-gray-200 dark:hover:bg-[#3d2b5e]"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
