import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';

interface Parcel {
    parcel_id: number;
    tracking_number: string;
    recipient_name: string;
    status: string;
    date_collected: string;
    collection_fee: number | string; // FIX: Added collection_fee
}

interface Props {
    parcels: Parcel[];
    totalRevenue: number;
    collectedCount: number;
    feePerParcel: number;
    filter: string;
    search: string;
    startDate: string;
    endDate: string;
}

const PRESETS = [
    { key: 'daily', label: 'Daily' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'biannual', label: 'Bi-Annual' },
    { key: 'annually', label: 'Annually' },
];

export default function Index({
    parcels,
    totalRevenue,
    collectedCount,
    feePerParcel,
    filter,
    search,
    startDate,
    endDate,
}: Props) {
    const [searchInput, setSearchInput] = useState(search);
    const [activeFilter, setActiveFilter] = useState(filter);
    const [customStart, setCustomStart] = useState(startDate);
    const [customEnd, setCustomEnd] = useState(endDate);
    const [showCustom, setShowCustom] = useState(filter === 'custom');

    const runQuery = (params: Record<string, string>) => {
        router.get(route('financial-reports'), { search: searchInput, ...params });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        runQuery({ filter: activeFilter, ...(activeFilter === 'custom' ? { start_date: customStart, end_date: customEnd } : {}) });
    };

    const handlePresetClick = (newFilter: string) => {
        setActiveFilter(newFilter);
        setShowCustom(false);
        runQuery({ filter: newFilter });
    };

    const handleCustomApply = () => {
        if (!customStart || !customEnd) return;
        setActiveFilter('custom');
        runQuery({ filter: 'custom', start_date: customStart, end_date: customEnd });
    };

    const pdfHref = route('financial-reports.pdf', {
        filter: activeFilter,
        search: searchInput,
        ...(activeFilter === 'custom' ? { start_date: customStart, end_date: customEnd } : {}),
    });

    const formatCurrency = (amount: number | string | null | undefined): string => {
        const numericAmount = Number(amount) || 0;
        return `R${numericAmount.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => (dateString ? new Date(dateString).toLocaleDateString('en-ZA') : '—');

    return (
        <DashboardLayout title="Financial Reports">
            <Head title="Financial Reports" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports Overview</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Revenue from collected parcels, {formatDate(startDate)} – {formatDate(endDate)}
                        </p>
                    </div>

                    <div className="mb-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search tracking number or recipient..."
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-white"
                                />
                                <button type="submit" className="rounded-lg bg-gray-800 px-6 py-2 text-white transition hover:bg-gray-700 dark:bg-[#4a1a6b]">
                                    Search
                                </button>
                            </form>
                            <a
                                href={pdfHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Download PDF
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() => handlePresetClick(p.key)}
                                    className={`rounded-lg px-4 py-2 transition ${
                                        activeFilter === p.key
                                            ? 'bg-orange-500 text-white'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-gray-300 dark:hover:bg-[#2d1b4e]'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowCustom((v) => !v)}
                                className={`rounded-lg px-4 py-2 transition ${
                                    activeFilter === 'custom'
                                        ? 'bg-orange-500 text-white'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#4a1a6b] dark:bg-[#1e1333] dark:text-gray-300 dark:hover:bg-[#2d1b4e]'
                                }`}
                            >
                                Custom Range
                            </button>
                        </div>

                        {showCustom && (
                            <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">From</label>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-[#4a1a6b] dark:bg-[#120b1c] dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">To</label>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-[#4a1a6b] dark:bg-[#120b1c] dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomApply}
                                    disabled={!customStart || !customEnd}
                                    className="rounded-lg bg-[#2d1b4e] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Avg R{feePerParcel.toFixed(2)} / parcel</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-green-600 dark:text-green-400">Collected</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{collectedCount}</h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Packages Collected</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{filter}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatDate(startDate)} – {formatDate(endDate)}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Report Period</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-white shadow dark:border-[#2d1b4e] dark:bg-[#1e1333]">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-[#2d1b4e]">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collected Parcels</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{collectedCount} records</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-[#2d1b4e]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Tracking Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Recipient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Date Collected</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-[#2d1b4e] dark:bg-[#1e1333]">
                                    {parcels.length > 0 ? (
                                        parcels.map((parcel) => (
                                            <tr key={parcel.parcel_id} className="hover:bg-gray-50 dark:hover:bg-[#2d1b4e]/50">
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">{parcel.tracking_number}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">{parcel.recipient_name}</td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {formatDate(parcel.date_collected)}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                    {/* FIX: Display actual parcel fee */}
                                                    {formatCurrency(parcel.collection_fee)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No collected parcels in this period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}