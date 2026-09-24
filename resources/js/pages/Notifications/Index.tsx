import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Bell, RefreshCw, Send, CheckCircle2, AlertCircle, Eye, Box, ArrowLeft, ArrowRight, Calendar, CheckCheck } from 'lucide-react';

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

type Props = { title: string; notifications: Paginated<Notification> };

export default function Index({ title, notifications }: Props) {
    
    const handleResend = (notificationId: number) => {
        if (confirm('Are you sure you want to re-queue and send this notification again?')) {
            router.post(`/notifications/${notificationId}/resend`, {}, { preserveScroll: true });
        }
    };

    const handleMarkCollected = (notificationId: number) => {
        if (confirm('Mark this parcel as collected?')) {
            router.post(`/notifications/${notificationId}/collect`, {}, { preserveScroll: true });
        }
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-6xl space-y-6 p-6">
                
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Dispatch Notifications</h2>
                        <p className="text-gray-500 mt-1">Track automated SMS, Email, and status system updates.</p>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d1b4e]">History Logs</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                            {notifications.data.length} updates logged on this page
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6"><Box className="h-3.5 w-3.5 inline mr-1" /> Parcel</th>
                                    <th className="p-4"><Calendar className="h-3.5 w-3.5 inline mr-1" /> Date to Collect</th>
                                    <th className="p-4"><Send className="h-3.5 w-3.5 inline mr-1" /> Channel</th>
                                    <th className="p-4">Message Body</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {notifications.data.map((n) => (
                                    <tr key={n.notification_id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 pl-6 font-mono font-medium text-gray-900">
                                            {n.parcel ? (
                                                <Link href={`/parcels/${n.parcel.parcel_id}`} className="text-[#e85d04] hover:underline font-semibold">
                                                    {n.parcel.tracking_number || n.parcel.tracking_label}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {n.parcel?.date_collected ? (
                                                <span className="font-medium text-emerald-600">{n.parcel.date_collected}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Not collected</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wide">
                                                {n.channel}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs text-gray-600 truncate" title={n.message}>
                                            {n.message}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                {n.parcel?.status === 'collected' ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none capitalize font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Collected
                                                    </Badge>
                                                ) : n.status === 'failed' ? (
                                                    <Badge className="bg-red-50 text-red-700 border border-red-200 shadow-none capitalize font-semibold flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" /> {n.status}
                                                    </Badge>
                                                ) : n.status === 'sent' || n.status === 'delivered' ? (
                                                    <Badge className="bg-green-50 text-green-700 border border-green-200 shadow-none capitalize font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> {n.status}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 shadow-none capitalize font-semibold flex items-center gap-1 animate-pulse">
                                                        <RefreshCw className="h-3 w-3" /> {n.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                {/* Mark Collected Action Button */}
                                                {n.parcel && n.parcel.status !== 'collected' && (
                                                    <button 
                                                        onClick={() => handleMarkCollected(n.notification_id)} 
                                                        className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-100" 
                                                        title="Mark as Collected"
                                                    >
                                                        <CheckCheck className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <Link href={`/notifications/${n.notification_id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="View Log Detail">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleResend(n.notification_id)} 
                                                    className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" 
                                                    title="Resend Dispatch Log"
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {notifications.data.length === 0 && (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            No notifications sent or logged yet.
                        </div>
                    )}
                </div>

                {/* Navigation Links Component */}
                <nav className="flex items-center justify-center gap-2 pt-2">
                    {notifications.links.map((link, i) => {
                        const cleanLabel = link.label
                            .replace('&laquo; Previous', '')
                            .replace('Next &raquo;', '');

                        return (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-xl px-4 py-2 text-xs font-semibold border transition-all ${
                                    !link.url ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-100 text-gray-400' :
                                    link.active ? 'bg-gradient-to-r from-[#f5a623] to-[#e85d04] text-white border-transparent shadow-sm' : 
                                    'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {link.label.includes('Previous') ? (
                                    <span className="flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Prev</span>
                                ) : link.label.includes('Next') ? (
                                    <span className="flex items-center gap-1">Next <ArrowRight className="h-3 w-3" /></span>
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