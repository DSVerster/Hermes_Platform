import * as React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Parcel } from '@/types/models';

type Props = {
    title: string;
    parcel: Parcel;
};

const statusStyle: Record<Parcel['status'], string> = {
    received: 'bg-slate-200 text-slate-800',
    ready_for_collection: 'bg-amber-200 text-amber-900',
    collected: 'bg-emerald-200 text-emerald-900',
};

export default function Show({ title, parcel }: Props) {
    const [open, setOpen] = React.useState(false);

    // courier_id / staff_id are resubmitted unchanged below — UpdateParcelRequest
    // requires both on every save, but `show()` doesn't send the couriers/staffs
    // lookup lists needed to offer them as dropdowns. Reassigning either from this
    // dialog needs that data added server-side first — flag it for backend, don't
    // add it here.
    const { data, setData, put, processing, errors } = useForm({
        tracking_label: parcel.tracking_label,
        recipient_name: parcel.recipient_name,
        recipient_phone: parcel.recipient_phone,
        parcel_type: parcel.parcel_type,
        storage_location: parcel.storage_location,
        courier_id: String(parcel.courier_id),
        staff_id: String(parcel.staff_id),
        status: parcel.status,
        collection_fee: parcel.collection_fee,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/parcels/${parcel.parcel_id}`, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/parcels" className="text-muted-foreground text-sm underline">
                            ← Back to Parcels
                        </Link>
                        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Edit Parcel</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="tracking_label">Tracking Label</Label>
                                    <Input
                                        id="tracking_label"
                                        value={data.tracking_label}
                                        onChange={(e) => setData('tracking_label', e.target.value)}
                                    />
                                    <InputError message={errors.tracking_label} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="recipient_name">Recipient Name</Label>
                                        <Input
                                            id="recipient_name"
                                            value={data.recipient_name}
                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                        />
                                        <InputError message={errors.recipient_name} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="recipient_phone">Recipient Phone</Label>
                                        <Input
                                            id="recipient_phone"
                                            value={data.recipient_phone}
                                            onChange={(e) => setData('recipient_phone', e.target.value)}
                                        />
                                        <InputError message={errors.recipient_phone} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="parcel_type">Parcel Type</Label>
                                        <Input id="parcel_type" value={data.parcel_type} onChange={(e) => setData('parcel_type', e.target.value)} />
                                        <InputError message={errors.parcel_type} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="storage_location">Storage Location</Label>
                                        <Input
                                            id="storage_location"
                                            value={data.storage_location}
                                            onChange={(e) => setData('storage_location', e.target.value)}
                                        />
                                        <InputError message={errors.storage_location} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            className="w-full rounded-md border p-2 text-sm"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as Parcel['status'])}
                                        >
                                            <option value="received">Received</option>
                                            <option value="ready_for_collection">Ready for Collection</option>
                                            <option value="collected">Collected</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="collection_fee">Collection Fee</Label>
                                        <Input
                                            id="collection_fee"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.collection_fee}
                                            onChange={(e) => setData('collection_fee', e.target.value)}
                                        />
                                        <InputError message={errors.collection_fee} />
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-xs">
                                    Courier and handling staff aren't reassignable from this dialog yet — that needs a small backend addition
                                    (see notes).
                                </p>

                                <Button type="submit" disabled={processing} className="w-full">
                                    Save Changes
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid grid-cols-2 gap-4 rounded-xl border p-6">
                    <div>
                        <span className="text-muted-foreground text-sm">Tracking Label</span>
                        <p className="font-mono">{parcel.tracking_label}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Status</span>
                        <p>
                            <Badge className={statusStyle[parcel.status]}>{parcel.status.replace(/_/g, ' ')}</Badge>
                        </p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Recipient</span>
                        <p>{parcel.recipient_name}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Phone</span>
                        <p>{parcel.recipient_phone}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Courier</span>
                        <p>{parcel.courier?.name ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Handled By</span>
                        <p>{parcel.staff ? `${parcel.staff.name} ${parcel.staff.surname}` : '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Parcel Type</span>
                        <p>{parcel.parcel_type}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Storage</span>
                        <p>{parcel.storage_location}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Received</span>
                        <p>{parcel.date_received ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Collected</span>
                        <p>{parcel.date_collected ?? '—'}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-sm">Collection Fee</span>
                        <p>R{parcel.collection_fee}</p>
                    </div>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-medium">Notifications</h2>
                    {(parcel.notifications ?? []).map((n) => (
                        <div key={n.notification_id} className="rounded-lg border p-3 text-sm">
                            {n.channel.toUpperCase()} · {n.status} · {n.message}
                        </div>
                    ))}
                    {(parcel.notifications ?? []).length === 0 && <p className="text-muted-foreground text-sm">No notifications sent yet.</p>}
                </section>
            </div>
        </DashboardLayout>
    );
}
