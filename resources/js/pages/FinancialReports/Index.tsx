import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';

interface Parcel {
    parcel_id: number;
    tracking_number: string;
    recipient_name: string;
    status: string;
    collection_fee: number;
    date_received: string;
}
interface Props {
    parcels: Parcel[];
    totalRevenue: number;
    pendingRevenue: number;
    completedRevenue: number;
    filter: string;
    search: string;
    totalParcels: number;
    pendingCount: number;
    completedCount: number;
}

export default function Index({ parcels, totalRevenue, pendingRevenue, completedRevenue, filter, search, totalParcels }: Props) {
    const [searchInput, setSearchInput] = useState(search);
    const [activeFilter, setActiveFilter] = useState(filter);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('financial-reports'), { search: searchInput, filter: activeFilter });
    };
    const handleFilterChange = (newFilter: string) => {
        setActiveFilter(newFilter);
        router.get(route('financial-reports'), { search: searchInput, filter: newFilter });
    };

    const formatCurrency = (amount: number | string | null | undefined): string => {
        const numericAmount = Number(amount) || 0;
        return numericAmount.toFixed(2);
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-ZA');

    return (
        <DashboardLayout title="Financial Reports">
            <Head title="Financial Reports" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports Overview</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track revenue and parcel costs.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." className="flex-1 px-4 py-2 border border-gray-300 dark:border-[#4a1a6b] rounded-lg bg-white dark:bg-[#1e1333] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                            <button type="submit" className="px-6 py-2 bg-gray-800 dark:bg-[#4a1a6b] text-white rounded-lg hover:bg-gray-700 transition">Search</button>
                        </form>
                        <div className="flex gap-2">
                            {['monthly', '6months', 'annually'].map((f) => (
                                <button key={f} onClick={() => handleFilterChange(f)} className={`px-4 py-2 rounded-lg transition ${activeFilter === f ? 'bg-orange-500 text-white' : 'bg-white dark:bg-[#1e1333] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-[#4a1a6b] hover:bg-gray-50 dark:hover:bg-[#2d1b4e]'}`}>
                                    {f === 'monthly' ? 'Monthly' : f === '6months' ? '6 Months' : 'Annually'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-[#1e1333] rounded-lg shadow p-6 border border-gray-100 dark:border-[#2d1b4e]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">All Time</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total Revenue</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e1333] rounded-lg shadow p-6 border border-gray-100 dark:border-[#2d1b4e]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <span className="text-sm text-blue-600 dark:text-blue-400">Received</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(pendingRevenue)}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Awaiting Collection</p>
                        </div>
                        <div className="bg-white dark:bg-[#1e1333] rounded-lg shadow p-6 border border-gray-100 dark:border-[#2d1b4e]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-sm text-green-600 dark:text-green-400">Completed</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(completedRevenue)}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Collected</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e1333] rounded-lg shadow border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#2d1b4e] flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Parcels</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{totalParcels} records</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-[#2d1b4e]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tracking Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Recipient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cost</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#1e1333] divide-y divide-gray-200 dark:divide-[#2d1b4e]">
                                    {parcels.map((parcel) => (
                                        <tr key={parcel.parcel_id} className="hover:bg-gray-50 dark:hover:bg-[#2d1b4e]/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{parcel.tracking_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{parcel.recipient_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(parcel.date_received)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(parcel.collection_fee)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    parcel.status === 'collected'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                    {parcel.status === 'collected' ? 'Collected' : 'Received'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}