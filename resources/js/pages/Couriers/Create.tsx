import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type Props = { title: string };

export default function Create({ title }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        contact_person: '',
        contact_number: '',
        email: '',
        website: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/couriers');
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
                    <div className="space-y-1">
                        <Label htmlFor="name">Courier Name</Label>
                        <Input id="name" autoFocus value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="contact_person">Contact Person</Label>
                            <Input id="contact_person" value={data.contact_person} onChange={(e) => setData('contact_person', e.target.value)} />
                            <InputError message={errors.contact_person} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <Input id="contact_number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />
                            <InputError message={errors.contact_number} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                            <InputError message={errors.website} />
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        Add Courier
                    </Button>
                </form>
            </div>
        </DashboardLayout>
    );
}
