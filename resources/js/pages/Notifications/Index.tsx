import { Badge } from '@/components/ui/badge';

import DashboardLayout from '@/layouts/dashboard-layout';

import { Head, Link, router } from '@inertiajs/react';

import { AlertCircle, ArrowLeft, ArrowRight, Bell, Box, CheckCheck, CheckCircle2, Eye, RefreshCw, Send } from 'lucide-react';

type Parcel = {
    parcel_id: number;
    tracking_number: string;
    tracking_label?: string;
    recipient_name?: string;
    recipient_email?: string;
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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
};

type Props = {
    title: string;
    notifications: Paginated<Notification>;
};

export default function Index({ title, notifications }: Props) {
    const handleResend = (notificationId: number, email?: string) => {
        const message = email ? `Resend this notification email to ${email}?` : 'Are you sure you want to resend this notification email?';

        if (confirm(message)) {
            router.post(
                `/notifications/${notificationId}/resend`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleMarkCollected = (notificationId: number) => {
        if (confirm('Mark this parcel as collected?')) {
            router.post(
                `/notifications/${notificationId}/collect`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const formatDate = (date?: string | null) => {
        if (!date) {
            return null;
        }

        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Dispatch Notifications</h2>

                        <p className="mt-1 text-gray-500">Track automated SMS, Email, and status system updates.</p>
                    </div>
                </header>

                {/* Notification Table */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Table Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-[#2d1b4e]">History Logs</h3>

                        <div className="flex items-center gap-3">
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                {notifications.data.length} updates logged on this page
                            </span>

                            <Link
                                href="/notifications/history"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Message History
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1250px] border-collapse text-left text-sm">
                            <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                <tr>
                                    <th className="min-w-[150px] p-4 pl-6 whitespace-nowrap">
                                        <Box className="mr-1 inline h-3.5 w-3.5" />
                                        Parcel
                                    </th>

                                    <th className="min-w-[230px] p-4 whitespace-nowrap">
                                        <Send className="mr-1 inline h-3.5 w-3.5" />
                                        Recipient Email
                                    </th>

                                    <th className="min-w-[100px] p-4 whitespace-nowrap">Channel</th>

                                    <th className="min-w-[320px] p-4">Message Body</th>

                                    <th className="min-w-[170px] p-4 whitespace-nowrap">Date to Collect</th>

                                    <th className="min-w-[150px] p-4 whitespace-nowrap">Status</th>

                                    <th className="min-w-[220px] p-4 pr-6 text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {notifications.data.map((n) => (
                                    <tr key={n.notification_id} className="transition-colors hover:bg-gray-50/80">
                                        {/* Parcel */}
                                        <td className="min-w-[150px] p-4 pl-6">
                                            {n.parcel ? (
                                                <div>
                                                    <Link
                                                        href={`/parcels/${n.parcel.parcel_id}`}
                                                        className="font-semibold text-[#e85d04] hover:underline"
                                                    >
                                                        {n.parcel.tracking_number || n.parcel.tracking_label || '—'}
                                                    </Link>

                                                    {n.parcel.recipient_name && (
                                                        <p className="mt-1 text-xs text-gray-500">{n.parcel.recipient_name}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>

                                        {/* Recipient Email */}
                                        <td className="min-w-[230px] p-4">
                                            {n.parcel?.recipient_email ? (
                                                <span
                                                    className="block max-w-[230px] truncate font-medium text-gray-700"
                                                    title={n.parcel.recipient_email}
                                                >
                                                    {n.parcel.recipient_email}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No email</span>
                                            )}
                                        </td>

                                        {/* Channel */}
                                        <td className="min-w-[100px] p-4 whitespace-nowrap">
                                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold tracking-wide text-gray-700 uppercase">
                                                {n.channel}
                                            </span>
                                        </td>

                                        {/* Message */}
                                        <td className="min-w-[320px] p-4 text-gray-600" title={n.message}>
                                            <div className="max-w-[320px] leading-6 break-words">{n.message}</div>
                                        </td>

                                        {/* Date to Collect */}
                                        <td className="min-w-[170px] p-4 whitespace-nowrap text-gray-600">
                                            {n.parcel?.date_collected ? (
                                                <span className="font-medium text-emerald-600">{formatDate(n.parcel.date_collected)}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Not collected</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="min-w-[150px] p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {n.parcel?.status === 'collected' ? (
                                                    <Badge className="flex items-center gap-1 border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 shadow-none">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Collected
                                                    </Badge>
                                                ) : n.parcel?.status === 'received' ? (
                                                    <Badge className="flex items-center gap-1 border border-blue-200 bg-blue-50 font-semibold text-blue-700 shadow-none">
                                                        <Box className="h-3 w-3" />
                                                        Received
                                                    </Badge>
                                                ) : n.status === 'failed' ? (
                                                    <Badge className="flex items-center gap-1 border border-red-200 bg-red-50 font-semibold text-red-700 shadow-none">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Failed
                                                    </Badge>
                                                ) : n.status === 'sent' || n.status === 'delivered' ? (
                                                    <Badge className="flex items-center gap-1 border border-green-200 bg-green-50 font-semibold text-green-700 shadow-none">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        {n.status}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="flex animate-pulse items-center gap-1 border border-amber-200 bg-amber-50 font-semibold text-amber-700 shadow-none">
                                                        <RefreshCw className="h-3 w-3" />
                                                        {n.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="min-w-[220px] p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Mark Collected */}
                                                {n.parcel && n.parcel.status !== 'collected' && (
                                                    <button
                                                        onClick={() => handleMarkCollected(n.notification_id)}
                                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-emerald-600"
                                                        title="Mark as Collected"
                                                    >
                                                        <CheckCheck className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* View */}
                                                <Link
                                                    href={`/notifications/${n.notification_id}`}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                                    title="View Notification Detail"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                {/* Resend Email */}
                                                {n.channel === 'email' && n.parcel?.recipient_email && (
                                                    <button
                                                        onClick={() => handleResend(n.notification_id, n.parcel?.recipient_email)}
                                                        className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                                                        title={`Resend email to ${n.parcel.recipient_email}`}
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                        Resend Email
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {notifications.data.length === 0 && (
                        <div className="p-12 text-center text-sm text-gray-400">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                            No notifications sent or logged yet.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <nav className="flex items-center justify-center gap-2 pt-2">
                    {notifications.links.map((link, i) => {
                        const cleanLabel = link.label.replace('&laquo; Previous', '').replace('Next &raquo;', '');

                        return (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                                    !link.url
                                        ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 opacity-40'
                                        : link.active
                                          ? 'border-transparent bg-gradient-to-r from-[#f5a623] to-[#e85d04] text-white shadow-sm'
                                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {link.label.includes('Previous') ? (
                                    <span className="flex items-center gap-1">
                                        <ArrowLeft className="h-3 w-3" />
                                        Prev
                                    </span>
                                ) : link.label.includes('Next') ? (
                                    <span className="flex items-center gap-1">
                                        Next
                                        <ArrowRight className="h-3 w-3" />
                                    </span>
                                ) : (
                                    cleanLabel
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </DashboardLayout>
    );
}
