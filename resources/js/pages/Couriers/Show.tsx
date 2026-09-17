import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import type { Courier } from '@/types/models';

type Props = { title: string; courier: Courier };

export default function Show({ title, courier }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/couriers" className="text-muted-foreground text-sm underline">
                            ← Back to Couriers
                        </Link>
                        <h1 className="mt-1 text-2xl font-semibold">{courier.name}</h1>
                    </div>
                    <Link href={`/couriers/${courier.courier_id}/edit`}>
                        <Button variant="outline">Edit</Button>
                    </Link>
                </div>

                <section className="grid grid-cols-2 gap-4 rounded-xl border p-6">
                    <div>
                        <span className="text-muted-foreground text-sm">Contact Person</span>
                        <p>{courier.contact_person ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Contact Number</span>
                        <p>{courier.contact_number ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Email</span>
                        <p>{courier.email ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Website</span>
                        <p>{courier.website ?? '—'}</p>
                    </div>
                    {courier.description && (
                        <div className="col-span-2">
                            <span className="text-muted-foreground text-sm">Description</span>
                            <p>{courier.description}</p>
                        </div>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-medium">Parcels via this Courier</h2>
                    {(courier.parcels ?? []).map((p) => (
                        <Link key={p.parcel_id} href={`/parcels/${p.parcel_id}`} className="block rounded-lg border p-3 text-sm underline">
                            {p.tracking_label} — {p.recipient_name}
                        </Link>
                    ))}
                    {(courier.parcels ?? []).length === 0 && (
                        <p className="text-muted-foreground text-sm">No parcels logged for this courier yet.</p>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
