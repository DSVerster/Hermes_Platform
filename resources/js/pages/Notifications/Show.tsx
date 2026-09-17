import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import type { Notification } from '@/types/models';

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

                <section className="space-y-4 rounded-xl border p-6">
                    <div>
                        <span className="text-muted-foreground text-sm">Parcel</span>
                        <p>
                            {notification.parcel ? (
                                <Link href={`/parcels/${notification.parcel.parcel_id}`} className="underline">
                                    {notification.parcel.tracking_label}
                                </Link>
                            ) : (
                                '—'
                            )}
                        </p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Channel</span>
                        <p>{notification.channel.toUpperCase()}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Message</span>
                        <p>{notification.message}</p>
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
