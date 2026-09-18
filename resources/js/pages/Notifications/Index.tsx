import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import type { Notification, Paginated } from '@/types/models';

type Props = { title: string; notifications: Paginated<Notification> };

export default function Index({ title, notifications }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">{title}</h1>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">Parcel</th>
                                <th className="p-3">Channel</th>
                                <th className="p-3">Message</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.data.map((n) => (
                                <tr key={n.notification_id} className="border-t">
                                    <td className="p-3 font-mono">
                                        {n.parcel ? (
                                            <Link href={`/parcels/${n.parcel.parcel_id}`} className="underline">
                                                {n.parcel.tracking_label}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td className="p-3">{n.channel.toUpperCase()}</td>
                                    <td className="p-3">{n.message}</td>
                                    <td className="p-3">
                                        <Badge variant={n.status === 'failed' ? 'destructive' : 'secondary'}>{n.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {notifications.data.length === 0 && (
                        <div className="p-10 text-center">
                            <p className="text-muted-foreground text-sm">No notifications sent yet.</p>
                        </div>
                    )}
                </div>

                <nav className="flex flex-wrap gap-1">
                    {notifications.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            </div>
        </DashboardLayout>
    );
}
