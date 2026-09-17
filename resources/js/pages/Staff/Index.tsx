import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import type { StaffMember } from '@/types/models';

type Props = { title: string; staff: StaffMember[] };

export default function Index({ title, staff }: Props) {
    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <h1 className="text-2xl font-semibold">{title}</h1>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((s) => (
                                <tr key={s.staff_id} className="border-t">
                                    <td className="p-3">
                                        {s.name} {s.surname}
                                    </td>
                                    <td className="p-3">{s.email_account}</td>
                                    <td className="p-3">
                                        <Badge variant={s.role === 'admin' ? 'default' : 'secondary'}>{s.role.replace('_', ' ')}</Badge>
                                    </td>
                                    <td className="p-3 text-right">
                                        <Link href={`/staff/${s.staff_id}/edit`} className="underline">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
