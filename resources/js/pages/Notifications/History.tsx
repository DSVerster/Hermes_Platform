import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link } from '@inertiajs/react';

interface Parcel {
    parcel_id: number | string;
    tracking_number?: string;
    recipient_name?: string;
    recipient_email?: string;
    status?: string;
    date_collected?: string | null;
}

interface Message {
    notification_id: number;
    parcel_id: number | string;
    channel: string;
    message: string;
    status: string;
    sent_at?: string | null;
    created_at?: string;
    parcel?: Parcel | null;
}

interface HistoryProps {
    title: string;
    messages: {
        data: Message[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function History({ title, messages }: HistoryProps) {
    const formatDate = (date?: string | null) => {
        if (!date) {
            return '—';
        }

        return new Date(date).toLocaleString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMessageStatus = (status: string) => {
        if (status === 'failed') {
            return {
                text: 'Failed',
                className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            };
        }

        if (status === 'delivered') {
            return {
                text: 'Delivered',
                className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            };
        }

        if (status === 'sent') {
            return {
                text: 'Sent',
                className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            };
        }

        return {
            text: status || 'Unknown',
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        };
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message History</h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">View all successfully sent messages.</p>
                    </div>

                    <Link href="/notifications" className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                        Back to Notifications
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-[#2d1b4e]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1500px] table-auto text-left text-sm">
                            <thead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-[#3b2663] dark:text-gray-200">
                                <tr>
                                    <th className="w-[170px] px-6 py-4 whitespace-nowrap">Date Message Sent</th>

                                    <th className="w-[130px] px-6 py-4 whitespace-nowrap">Parcel</th>

                                    <th className="w-[220px] px-6 py-4">Recipient</th>

                                    <th className="w-[100px] px-6 py-4 whitespace-nowrap">Channel</th>

                                    <th className="w-[380px] px-6 py-4">Message</th>

                                    <th className="w-[140px] px-6 py-4 whitespace-nowrap">Message Status</th>

                                    <th className="w-[150px] px-6 py-4 whitespace-nowrap">Date Collected</th>

                                    <th className="w-[140px] px-6 py-4 whitespace-nowrap">Parcel Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-purple-800">
                                {messages.data.length > 0 ? (
                                    messages.data.map((item) => {
                                        const messageStatus = getMessageStatus(item.status);

                                        const parcelCollected = item.parcel?.status === 'collected';

                                        return (
                                            <tr key={item.notification_id} className="hover:bg-gray-50 dark:hover:bg-[#38245d]">
                                                <td className="w-[170px] px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                    {formatDate(item.sent_at)}
                                                </td>

                                                <td className="w-[130px] px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {item.parcel?.parcel_id ?? item.parcel_id}

                                                    {item.parcel?.tracking_number && (
                                                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            {item.parcel.tracking_number}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="w-[220px] px-6 py-4 text-gray-700 dark:text-gray-200">
                                                    <div className="break-words">{item.parcel?.recipient_name ?? '—'}</div>

                                                    {item.parcel?.recipient_email && (
                                                        <div className="mt-1 text-xs break-all text-gray-500 dark:text-gray-400">
                                                            {item.parcel.recipient_email}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="w-[100px] px-6 py-4 whitespace-nowrap">
                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {item.channel.toUpperCase()}
                                                    </span>
                                                </td>

                                                <td className="w-[380px] px-6 py-4 text-gray-700 dark:text-gray-200">
                                                    <div className="leading-6 break-words whitespace-normal">{item.message}</div>
                                                </td>

                                                <td className="w-[140px] px-6 py-4 whitespace-nowrap">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${messageStatus.className}`}>
                                                        {messageStatus.text}
                                                    </span>
                                                </td>

                                                <td className="w-[150px] px-6 py-4 whitespace-nowrap">
                                                    {parcelCollected && item.parcel?.date_collected ? (
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            {String(item.parcel.date_collected).split('T')[0]}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not collected</span>
                                                    )}
                                                </td>

                                                <td className="w-[140px] px-6 py-4 whitespace-nowrap">
                                                    {parcelCollected ? (
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            Collected
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            Not Collected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No message history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-600 dark:border-purple-800 dark:text-gray-300">
                        Total messages: {messages.total}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
