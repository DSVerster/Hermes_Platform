import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Truck, User, Phone, Layers } from 'lucide-react';

// Definieer die Courier-tipe direk hier om TypeScript-foute op te los
type Courier = {
    courier_id: number;
    name: string;
    contact_person?: string | null;
    contact_number?: string | null;
    parcels_count?: number;
};

type Props = { title: string; couriers: Courier[] };

export default function Index({ title, couriers }: Props) {
    const handleDelete = (courierId: number, name: string) => {
        if (confirm(`Are you sure you want to completely remove courier "${name}"? This action cannot be undone.`)) {
            // Stuur 'n DELETE-versoek na Laravel se CourierController@destroy
            router.delete(`/couriers/${courierId}`);
        }
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                {/* Header-afdeling */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Couriers Directory</h2>
                        <p className="text-gray-500 mt-1">Manage external shipping firms and dispatch handles.</p>
                    </div>
                    <Link href="/couriers/create">
                        <Button className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                            <Truck className="h-4 w-4 mr-2" />
                            Add Courier
                        </Button>
                    </Link>
                </header>

                {/* Tabel-komponent */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d1b4e]">All Couriers</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                            {couriers.length} registered
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6 flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Company Name</th>
                                    <th className="p-4"><User className="h-3.5 w-3.5 inline mr-1" /> Contact Person</th>
                                    <th className="p-4"><Phone className="h-3.5 w-3.5 inline mr-1" /> Contact Number</th>
                                    <th className="p-4"><Layers className="h-3.5 w-3.5 inline mr-1" /> Linked Parcels</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {couriers.map((c) => (
                                    <tr key={c.courier_id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 pl-6 font-semibold text-gray-900">
                                            {c.name}
                                        </td>
                                        <td className="p-4 text-gray-600">{c.contact_person ?? '—'}</td>
                                        <td className="p-4 text-gray-600">{c.contact_number ?? '—'}</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                                {c.parcels_count ?? 0} items
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {/* Sien Besonderhede */}
                                                <Link href={`/couriers/${c.courier_id}`} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                {/* Wysig Koerier */}
                                                <Link href={`/couriers/${c.courier_id}/edit`} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" title="Edit Courier">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>

                                                {/* Skrap-knoppie */}
                                                <button 
                                                    onClick={() => handleDelete(c.courier_id, c.name)} 
                                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" 
                                                    title="Delete Courier"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {couriers.length === 0 && (
                        <div className="p-12 text-center text-gray-500 text-sm">
                            No active shipping companies added yet. Click above to populate profiles.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
