import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import type { Courier } from '@/types/models';

type Props = { title: string; couriers: Courier[] };

export default function Index({ title, couriers }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Link href="/couriers/create">
                        <Button>Add Courier</Button>
                    </Link>
                </header>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Contact Person</th>
                                <th className="p-3">Contact Number</th>
                                <th className="p-3">Parcels</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {couriers.map((c) => (
                                <tr key={c.courier_id} className="border-t">
                                    <td className="p-3">
                                        <Link href={`/couriers/${c.courier_id}`} className="underline">
                                            {c.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">{c.contact_person ?? '—'}</td>
                                    <td className="p-3">{c.contact_number ?? '—'}</td>
                                    <td className="p-3">{c.parcels_count ?? 0}</td>
                                    <td className="p-3 text-right">
                                        <Link href={`/couriers/${c.courier_id}/edit`} className="underline">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {couriers.length === 0 && (
                        <div className="space-y-3 p-10 text-center">
                            <p className="text-muted-foreground text-sm">No couriers added yet.</p>
                            <Link href="/couriers/create">
                                <Button size="sm">Add Courier</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
