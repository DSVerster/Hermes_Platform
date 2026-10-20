import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import * as React from 'react';
import Barcode from 'react-barcode';

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
            <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href={route('parcels.index')}
                            className="flex items-center gap-1 text-sm font-medium text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Parcels
                        </Link>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    </div>
                </div>
                {/* Barcode Section */}
                <section className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-[#2d1b4e] dark:bg-[#120b1c]">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div ref={barcodeRef} className="rounded-lg bg-white p-4">
                            <Barcode value={parcel.tracking_number} format="CODE128" height={80} width={2} margin={10} />
                        </div>
                        <button
                            onClick={handleDownloadBarcode}
                            className="flex items-center gap-2 rounded-lg bg-[#2d1b4e] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-[#f5a623] dark:text-[#2d1b4e]"
                        >
                            <Download className="h-4 w-4" />
                            Download Barcode
                        </button>
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Tracking Number</span>
                        <p className="mt-0.5 font-mono text-base font-bold text-gray-900 dark:text-white">{parcel.tracking_number}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</span>
                        <p className="mt-0.5">
                            <Badge className={statusStyle[parcel.status]}>{parcel.status.replace(/_/g, ' ')}</Badge>
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Recipient</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">{parcel.recipient_name}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Phone</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">{parcel.recipient_phone}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Courier</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">{parcel.courier?.name ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Handled By</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">
                            {parcel.staff ? `${parcel.staff.name} ${parcel.staff.surname}` : '—'}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Parcel Type</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">{parcel.parcel_type}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Storage</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">{parcel.storage_location}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Received</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">
                            {parcel.date_received
                                ? (() => {
                                      const date = new Date(parcel.date_received);
                                      const day = String(date.getDate()).padStart(2, '0');
                                      const month = String(date.getMonth() + 1).padStart(2, '0');
                                      const year = date.getFullYear();
                                      return `${day}-${month}-${year}`;
                                  })()
                                : '—'}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Collected</span>
                        <p className="mt-0.5 text-base font-medium text-gray-900 dark:text-white">
                            {parcel.date_collected ? new Date(parcel.date_collected).toLocaleDateString('fr-CA') : '—'}
                        </p>
                    </div>
                </section>
                <section className="space-y-3 pt-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
                    {(parcel.notifications ?? []).map((n) => (
                        <div
                            key={n.notification_id}
                            className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm dark:border-[#2d1b4e] dark:bg-[#1e1333] dark:text-gray-200"
                        >
                            <span className="font-semibold">{n.channel.toUpperCase()}</span> · <span className="capitalize">{n.status}</span> ·{' '}
                            {n.message}
                        </div>
                    ))}
                    {(parcel.notifications ?? []).length === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No notifications sent yet.</p>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
