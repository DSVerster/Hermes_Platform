import * as React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Package, CheckCircle, Box, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type RecentParcel = {
    parcel_id: number;
    tracking_number: string;
    status: string;
    recipient_name: string;
    date_received: string;
};

type ChartPoint = {
    date: string;
    received: number;
    collected: number;
};

// NEW: DSS Forecast Type
type ForecastDay = {
    date: string;
    day_name: string;
    predicted_collections: number;
    is_peak: boolean;
    confidence: number;
};

type Props = {
    title: string;
    totalParcels: number;
    receivedCount: number;
    collectedCount: number;
    chartData: ChartPoint[];
    recentParcels: RecentParcel[];
    collectionForecast?: ForecastDay[]; // NEW PROP
};

const statusStyle: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800 font-medium',
    collected: 'bg-emerald-100 text-emerald-900 font-medium',
};

export default function Index({
    title,
    totalParcels,
    receivedCount,
    collectedCount,
    chartData,
    recentParcels,
    collectionForecast = [],
}: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title} Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-[#2d1b4e]/10 dark:bg-[#4a1a6b]/30 flex items-center justify-center">
                                <Package className="h-6 w-6 text-[#2d1b4e] dark:text-[#f5a623]" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">All Time</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{totalParcels}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Parcels</p>
                    </div>
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Box className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Received</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{receivedCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Awaiting Collection</p>
                    </div>
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Collected</span>
                        </div>
                        <p className="text-3xl font-bold text-[#2d1b4e] dark:text-white">{collectedCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Successfully Collected</p>
                    </div>
                </div>

                {/* Chart + Recent Parcels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Parcels This Week</h2>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e1333',
                                            border: '1px solid #4a1a6b',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Received" />
                                    <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Collected" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Parcels List */}
                    <div className="bg-white dark:bg-[#1e1333] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2d1b4e]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Parcels</h2>
                            <Link href={route('parcels.index')} className="text-sm text-[#e85d04] hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {recentParcels.map((p) => (
                                <div key={p.parcel_id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-[#2d1b4e] last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                                            p.status === 'collected' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                            {p.status === 'collected'
                                                ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                : <Box className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.tracking_number}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{p.recipient_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={statusStyle[p.status] || 'bg-gray-100 text-gray-600'}>
                                            {p.status.replace(/_/g, ' ')}
                                        </Badge>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {p.date_received ? new Date(p.date_received).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentParcels.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No parcels yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* NEW: DSS COLLECTION FORECAST SECTION         */}
                {/* ============================================ */}
                {collectionForecast.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#2d1b4e]">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5a623]/10 dark:bg-[#f5a623]/20">
                                <Calendar className="h-5 w-5 text-[#f5a623]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#2d1b4e] dark:text-white">
                                    Collection Volume Forecast
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Predicted staff collection demand for next 7 days
                                </p>
                            </div>
                            <Badge className="ml-auto bg-[#f5a623]/10 text-[#f5a623] hover:bg-[#f5a623]/20 border-[#f5a623]/30">
                                DSS Engine
                            </Badge>
                        </div>

                        {/* Peak Day Alert Banner */}
                        {collectionForecast.some(d => d.is_peak) && (
                            <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                                        High Volume Alert
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        <strong>{collectionForecast.find(d => d.is_peak)?.day_name}</strong> 
                                        ({collectionForecast.find(d => d.is_peak)?.date}) is predicted to be 
                                        significantly busier than average. Consider scheduling additional staff.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 7-Day Forecast Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {collectionForecast.map((day) => (
                                <div
                                    key={day.date}
                                    className={`rounded-xl border p-4 text-center transition-all ${
                                        day.is_peak
                                            ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 ring-2 ring-amber-200 dark:ring-amber-800'
                                            : 'border-gray-100 bg-white dark:border-[#2d1b4e] dark:bg-[#1e1333]'
                                    }`}
                                >
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {day.day_name.slice(0, 3)}
                                    </p>
                                    <p className={`text-2xl font-bold mt-1 ${
                                        day.is_peak ? 'text-amber-600 dark:text-amber-400' : 'text-[#2d1b4e] dark:text-white'
                                    }`}>
                                        {day.predicted_collections}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                        collections
                                    </p>
                                    
                                    {/* Confidence Bar */}
                                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                day.confidence >= 80 ? 'bg-green-500' : 
                                                day.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${day.confidence}%` }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-1">
                                        {day.confidence}% confidence
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Methodology Note */}
                        <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#120b1c] p-3 rounded-lg border border-gray-100 dark:border-[#2d1b4e]">
                            <BarChart3 className="h-3 w-3 shrink-0" />
                            <span>
                                Based on 30-day historical collection patterns with day-of-week trend analysis. 
                                Predictions use weighted averaging; confidence decreases for dates further in the future.
                            </span>
                        </div>
                    </div>
                )}
                {/* ============================================ */}
                {/* END DSS SECTION                              */}
                {/* ============================================ */}

            </div>
        </DashboardLayout>
    );
}