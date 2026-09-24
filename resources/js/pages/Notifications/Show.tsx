import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';

type Parcel = {
    parcel_id: number;
    tracking_number: string;
    tracking_label?: string;
    recipient_name?: string;
    date_collected?: string | null;
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

type Props = { title: string; notification: Notification };

export default function Show({ title, notification }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <div>
                    <Link href="/notifications" className="text-muted-foreground text-sm underline">
                        ← Back to Notifications
                    </Link>
                    <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
                </div>

                <section className="space-y-4 rounded-xl border p-6 bg-white shadow-sm">
                    <div>
                        <span className="text-muted-foreground text-sm">Parcel</span>
                        <p>
                            {notification.parcel ? (
                                <Link href={`/parcels/${notification.parcel.parcel_id}`} className="underline font-semibold text-[#e85d04]">
                                    {notification.parcel.tracking_number || notification.parcel.tracking_label}
                                </Link>
                            ) : (
                                '—'
                            )}
                        </p>
                    </div>

                    <div>
                        <span className="text-muted-foreground text-sm">Collection Date</span>
                        <p className="font-medium text-gray-800">
                            {notification.parcel?.date_collected ?? <span className="text-gray-400 italic">Not collected yet</span>}
                        </p>
                    </div>

                    <div>
                        <span className="text-muted-foreground text-sm">Channel</span>
                        <p className="font-semibold uppercase">{notification.channel}</p>
                    </div>
                    
                    <div>
                        <span className="text-muted-foreground text-sm">Message</span>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{notification.message}</p>
                    </div>
                    
                    <div>
                        <span className="text-muted-foreground text-sm">Status</span>
                        <p>
                            <Badge variant={notification.status === 'failed' ? 'destructive' : 'secondary'}>{notification.status}</Badge>
                        </p>
                    </div>
                    
                    <div>
                        <span className="text-muted-foreground text-sm">Sent At</span>
                        <p>{notification.sent_at ?? 'Not sent yet'}</p>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}