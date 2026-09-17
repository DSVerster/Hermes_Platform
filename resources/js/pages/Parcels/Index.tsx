import * as React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Parcel, Courier, StaffMember } from '@/types/models';

type Props = {
    title: string;
    parcels: Parcel[];
    couriers: Pick<Courier, 'courier_id' | 'name'>[];
    staffs: Pick<StaffMember, 'staff_id' | 'name' | 'surname'>[];
};

const statusStyle: Record<Parcel['status'], string> = {
    received: 'bg-slate-200 text-slate-800',
    ready_for_collection: 'bg-amber-200 text-amber-900',
    collected: 'bg-emerald-200 text-emerald-900',
};

export default function Index({ title, parcels, couriers }: Props) {
    const [open, setOpen] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_label: '',
        recipient_name: '',
        recipient_phone: '',
        parcel_type: '',
        storage_location: '',
        courier_id: '',
        collection_fee: '',
        status: 'received',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/parcels', {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Log New Parcel</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Log New Parcel</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="tracking_label">Tracking Label</Label>
                                    <Input
                                        id="tracking_label"
                                        autoFocus
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

                                <div className="space-y-1">
                                    <Label htmlFor="courier_id">Courier</Label>
                                    <select
                                        id="courier_id"
                                        className="w-full rounded-md border p-2 text-sm"
                                        value={data.courier_id}
                                        onChange={(e) => setData('courier_id', e.target.value)}
                                    >
                                        <option value="">Select a courier...</option>
                                        {couriers.map((c) => (
                                            <option key={c.courier_id} value={c.courier_id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.courier_id} />
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

                                <Button type="submit" disabled={processing} className="w-full">
                                    Log Parcel
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">Tracking</th>
                                <th className="p-3">Recipient</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Status</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((p) => (
                                <tr key={p.parcel_id} className="border-t">
                                    <td className="p-3 font-mono">{p.tracking_label}</td>
                                    <td className="p-3">{p.recipient_name}</td>
                                    <td className="p-3">{p.parcel_type}</td>
                                    <td className="p-3">
                                        <Badge className={statusStyle[p.status]}>{p.status.replace(/_/g, ' ')}</Badge>
                                    </td>
                                    <td className="p-3 text-right">
                                        <Link href={`/parcels/${p.parcel_id}`} className="underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {parcels.length === 0 && (
                        <div className="space-y-3 p-10 text-center">
                            <p className="text-muted-foreground text-sm">No parcels logged yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
