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

export default function Index({
    parcels,
    totalRevenue,
    pendingRevenue,
    completedRevenue,
    filter,
    search,
    totalParcels,
    pendingCount,
    completedCount,
}: Props) {
    const [searchInput, setSearchInput] = useState(search);
    const [activeFilter, setActiveFilter] = useState(filter);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('financial-reports'), {
            search: searchInput,
            filter: activeFilter,
        });
    };

    const handleFilterChange = (newFilter: string) => {
        setActiveFilter(newFilter);
        router.get(route('financial-reports'), {
            search: searchInput,
            filter: newFilter,
        });
    };

    const formatCurrency = (amount: number) => {
        return `R ${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    return (
        <DashboardLayout title="Financial Reports">
            <Head title="Financial Reports" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Financial Reports Overview</h1>
                        <p className="text-gray-600">Track revenue and parcel costs.</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search parcels by tracking number, recipient, or cost..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Search
                            </button>
                        </form>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            {['monthly', '6months', 'annually'].map((filterType) => (
                                <button
                                    key={filterType}
                                    onClick={() => handleFilterChange(filterType)}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        activeFilter === filterType
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {filterType === 'monthly' && 'Monthly'}
                                    {filterType === '6months' && '6 Months'}
                                    {filterType === 'annually' && 'Annually'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500">All Time</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
                            <p className="text-gray-600 text-sm mt-1">Total Revenue</p>
                        </div>

                        {/* Pending Revenue */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-orange-600">Pending</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(pendingRevenue)}</h3>
                            <p className="text-gray-600 text-sm mt-1">Awaiting Collection</p>
                        </div>

                        {/* Completed Revenue */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-green-600">Completed</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(completedRevenue)}</h3>
                            <p className="text-gray-600 text-sm mt-1">Collected</p>
                        </div>
                    </div>

                    {/* Parcels Table */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">All Parcels</h2>
                            <span className="text-sm text-gray-500">{totalParcels} records</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tracking Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recipient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cost
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {parcels.map((parcel) => (
                                        <tr key={parcel.parcel_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-orange-100 rounded-lg">
                                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {parcel.tracking_number}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{parcel.recipient_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{formatDate(parcel.date_received)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(parcel.collection_fee)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        parcel.status === 'collected'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-orange-100 text-orange-800'
                                                    }`}
                                                >
                                                    {parcel.status === 'collected' ? 'Collected' : 'Ready For Collection'}
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