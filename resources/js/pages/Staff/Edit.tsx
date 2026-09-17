import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { StaffMember } from '@/types/models';

type Props = { title: string; staffMember: StaffMember };

export default function Edit({ title, staffMember }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: staffMember.name,
        surname: staffMember.surname,
        role: staffMember.role,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/staff/${staffMember.staff_id}`);
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-2xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <form onSubmit={submit} className="space-y-4 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="surname">Surname</Label>
                            <Input id="surname" value={data.surname} onChange={(e) => setData('surname', e.target.value)} />
                            <InputError message={errors.surname} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="role">Role</Label>
                        {/* Role is one of exactly two values on the backend — a select, never free text. */}
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value as StaffMember['role'])}
                            className="w-full rounded-md border p-2 text-sm"
                        >
                            <option value="front_desk">Front Desk</option>
                            <option value="admin">Admin</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>
                    <Button type="submit" disabled={processing}>
                        Save Changes
                    </Button>
                </form>
            </div>
        </DashboardLayout>
    );
}
