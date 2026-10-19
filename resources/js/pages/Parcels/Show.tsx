import * as React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import Barcode from 'react-barcode';
import { Download, ArrowLeft } from 'lucide-react';

export interface Parcel {
    parcel_id: number;
    tracking_number: string;
    status: 'received' | 'collected' | string;
    recipient_name: string;
    recipient_phone: string;
    parcel_type: string;
    storage_location: string;
    courier_id: number | string;
    staff_id: number | string;
    collection_fee: number | string;
    date_received?: string | null;
    date_collected?: string | null;
    courier?: {
        name: string;
    } | null;
    staff?: {
        name: string;
        surname: string;
    } | null;
    notifications?: Array<{
        notification_id: number;
        channel: string;
        status: string;
        message: string;
    }>;
}

type Props = {
    title: string;
    parcel: Parcel;
};

const statusStyle: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800 font-medium dark:bg-blue-900/30 dark:text-blue-300',
    collected: 'bg-emerald-100 text-emerald-900 font-medium dark:bg-emerald-900/30 dark:text-emerald-300',
};

export default function Show({ title, parcel }: Props) {
    const barcodeRef = React.useRef<HTMLDivElement>(null);
    const handleDownloadBarcode = () => {
    const svgElement = barcodeRef.current?.querySelector('svg');

    if (!svgElement) {
        alert('Barcode is not ready yet. Try again.');
        return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');

    link.download = `Barcode-${parcel.tracking_number}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
};

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-3xl space-y-6 p-6 bg-white dark:bg-[#1e1333] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={route('parcels.index')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium underline flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Parcels
                        </Link>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    </div>
                </div>
                {/* Barcode Section */}
                <section className="rounded-xl border border-gray-200 dark:border-[#2d1b4e] bg-gray-50 dark:bg-[#120b1c] p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div ref={barcodeRef} className="bg-white p-4 rounded-lg">
                            <Barcode
                             
                                value={parcel.tracking_number}
                                format="CODE128"
                                height={80}
                                width={2}
                                margin={10}
                            />
                        </div>
                        <button
                            onClick={handleDownloadBarcode}
                            className="flex items-center gap-2 px-4 py-2 bg-[#2d1b4e] dark:bg-[#f5a623] text-white dark:text-[#2d1b4e] rounded-lg hover:opacity-90 transition text-sm font-medium"
                        >
                            <Download className="h-4 w-4" />
                            Download Barcode
                        </button>
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-6 rounded-xl border border-gray-200 dark:border-[#2d1b4e] bg-white dark:bg-[#1e1333] p-6 shadow-sm">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Tracking Number</span>
                        <p className="font-mono text-gray-900 dark:text-white font-bold text-base mt-0.5">{parcel.tracking_number}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Status</span>
                        <p className="mt-0.5">
                            <Badge className={statusStyle[parcel.status]}>{parcel.status.replace(/_/g, ' ')}</Badge>
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Recipient</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.recipient_name}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.recipient_phone}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Courier</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.courier?.name ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Handled By</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.staff ? `${parcel.staff.name} ${parcel.staff.surname}` : '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Parcel Type</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.parcel_type}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Storage</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.storage_location}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Received</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.date_received ? new Date(parcel.date_received).toLocaleDateString('fr-CA') : '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Collected</span>
                        <p className="text-gray-900 dark:text-white font-medium text-base mt-0.5">{parcel.date_collected ? new Date(parcel.date_collected).toLocaleDateString('fr-CA') : '—'}</p>
                    </div>
                </section>
                <section className="space-y-3 pt-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
                    {(parcel.notifications ?? []).map((n) => (
                        <div key={n.notification_id} className="rounded-lg border border-gray-200 dark:border-[#2d1b4e] bg-white dark:bg-[#1e1333] p-3 text-sm text-gray-800 dark:text-gray-200 shadow-sm">
                            <span className="font-semibold">{n.channel.toUpperCase()}</span> · <span className="capitalize">{n.status}</span> · {n.message}
                        </div>
                    ))}
                    {(parcel.notifications ?? []).length === 0 && <p className="text-gray-600 dark:text-gray-400 text-sm">No notifications sent yet.</p>}
                </section>
            </div>
        </DashboardLayout>
    );
}
