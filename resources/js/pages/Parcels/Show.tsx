import * as React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';

// Define the Parcel type locally
export interface Parcel {
    parcel_id: number;
    tracking_label: string;
    status: 'received' | 'ready_for_collection' | 'collected' | string;
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
    received: 'bg-blue-100 text-blue-800 font-medium',
    ready_for_collection: 'bg-amber-100 text-amber-900 font-medium',
    collected: 'bg-emerald-100 text-emerald-900 font-medium',
};

export default function Show({ title, parcel }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-3xl space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/parcels" className="text-gray-600 hover:text-gray-900 text-sm font-medium underline">
                            ← Back to Parcels
                        </Link>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">{title}</h1>
                    </div>
                </div>

                <section className="grid grid-cols-2 gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Tracking Label</span>
                        <p className="font-mono text-gray-900 font-bold text-base mt-0.5">{parcel.tracking_label}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Status</span>
                        <p className="mt-0.5">
                            <Badge className={statusStyle[parcel.status]}>{parcel.status.replace(/_/g, ' ')}</Badge>
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Recipient</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.recipient_name}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Phone</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.recipient_phone}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Courier</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.courier?.name ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Handled By</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.staff ? `${parcel.staff.name} ${parcel.staff.surname}` : '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Parcel Type</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.parcel_type}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Storage</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.storage_location}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Received</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.date_received ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Collected</span>
                        <p className="text-gray-900 font-medium text-base mt-0.5">{parcel.date_collected ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Collection Fee</span>
                        <p className="text-gray-900 font-bold text-base mt-0.5">R{parcel.collection_fee}</p>
                    </div>
                </section>

                <section className="space-y-3 pt-2">
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    {(parcel.notifications ?? []).map((n) => (
                        <div key={n.notification_id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm">
                            <span className="font-semibold">{n.channel.toUpperCase()}</span> · <span className="capitalize">{n.status}</span> · {n.message}
                        </div>
                    ))}
                    {(parcel.notifications ?? []).length === 0 && <p className="text-gray-600 text-sm">No notifications sent yet.</p>}
                </section>
            </div>
        </DashboardLayout>
    );
}