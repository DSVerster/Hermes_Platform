import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link } from '@inertiajs/react';

type Parcel = {
    parcel_id: number;
    tracking_number: string;
    tracking_label?: string;
    recipient_name?: string;
    date_collected?: string | null;
    status?: string;
};

type Notification = {
    notification_id: number;
    parcel_id: number;
    channel: string;
    message: string;
    status: 'sent' | 'pending' | 'failed' | string;
    sent_at?: string | null;
    parcel?: Parcel;
};

type Props = {
    title: string;
    notification: Notification;
};

export default function Show({ title, notification }: Props) {
    const isCollected = notification.parcel?.status === 'collected';

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <div>
                    <Link href="/notifications" className="text-sm text-muted-foreground underline">
                        ← Back to Notifications
                    </Link>

                    <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
                </div>

                <section className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
                    {/* Parcel */}
                    <div>
                        <span className="text-sm text-muted-foreground">Parcel</span>

                        <p>
                            {notification.parcel ? (
                                <Link href={`/parcels/${notification.parcel.parcel_id}`} className="font-semibold text-[#e85d04] underline">
                                    {notification.parcel.tracking_number || notification.parcel.tracking_label}
                                </Link>
                            ) : (
                                '—'
                            )}
                        </p>
                    </div>

                    {/* Date to Collect */}
                    <div>
                        <span className="text-sm text-muted-foreground">Date to Collect</span>

                        <p className="font-medium text-gray-800">
                            {notification.parcel?.date_collected ? (
                                notification.parcel.date_collected
                            ) : (
                                <span className="text-gray-400 italic">Not collected yet</span>
                            )}
                        </p>
                    </div>

                    {/* Channel */}
                    <div>
                        <span className="text-sm text-muted-foreground">Channel</span>

                        <p className="font-semibold uppercase">{notification.channel}</p>
                    </div>

                    {/* Message */}
                    <div>
                        <span className="text-sm text-muted-foreground">Message</span>

                        <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-gray-700">{notification.message}</p>
                    </div>

                    {/* Status */}
                    <div>
                        <span className="text-sm text-muted-foreground">Status</span>

                        <p>
                            {isCollected ? (
                                <Badge className="border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 shadow-none">
                                    Collected
                                </Badge>
                            ) : (
                                <Badge className="border border-amber-200 bg-amber-50 font-semibold text-amber-700 shadow-none">Pending</Badge>
                            )}
                        </p>
                    </div>

                    {/* Sent At */}
                    <div>
                        <span className="text-sm text-muted-foreground">Sent At</span>

                        <p className="font-medium text-gray-800">
                            {isCollected && notification.parcel?.date_collected ? (
                                notification.parcel.date_collected
                            ) : (
                                <span className="text-gray-400 italic">—</span>
                            )}
                        </p>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
