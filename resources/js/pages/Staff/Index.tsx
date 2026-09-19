import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, UserPlus, Users, Pencil, Trash2, ShieldAlert, Mail, UserCheck } from 'lucide-react';
import React, { useState } from 'react';

type StaffMember = {
    staff_id: number;
    name: string;
    surname: string;
    email_account: string;
    role: 'admin' | 'staff' | string;
};

type Props = { title: string; staff: StaffMember[] };

export default function Index({ title, staff = [] }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    // Single unified Inertia hook configuration for Create/Update handling
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        surname: '',
        email_account: '',
        role: 'staff',
        password: '',
    });

    const openCreate = () => {
        reset();
        clearErrors();
        setCreateOpen(true);
    };

    const openEdit = (member: StaffMember) => {
        clearErrors();
        setEditingStaff(member);
        setData({
            name: member.name,
            surname: member.surname,
            email_account: member.email_account,
            role: member.role,
            password: '', // Leave blank unless updating password
        });
        setEditOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('staff.store'), {
            onSuccess: () => {
                setCreateOpen(false);
                reset();
            },
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;
        // Puts values safely up to staff.update endpoint matching custom database parameter binding names
        put(route('staff.update', editingStaff.staff_id), {
            onSuccess: () => {
                setEditOpen(false);
                setEditingStaff(null);
                reset();
            },
        });
    };

    const handleDelete = (staffId: number, name: string, surname: string) => {
        if (confirm(`Are you sure you want to completely suspend and delete staff account: ${name} ${surname}?`)) {
            router.delete(route('staff.destroy', staffId));
        }
    };

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                
                {/* Header Actions Area */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d1b4e]">Staff Accounts Management</h2>
                        <p className="text-gray-500 mt-1">Configure internal employee security roles, access accessors, and platform permissions.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white shadow-lg shadow-orange-500/25">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Staff Member
                    </Button>
                </header>

                {/* Main Directory Table Component Layout */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d1b4e]">Internal Team Directory</h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                            {staff.length} profiles registered
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6"><UserCheck className="h-3.5 w-3.5 inline mr-1" /> Full Name</th>
                                    <th className="p-4"><Mail className="h-3.5 w-3.5 inline mr-1" /> Email Account Identifier</th>
                                    <th className="p-4"><Shield className="h-3.5 w-3.5 inline mr-1" /> System Privilege</th>
                                    <th className="p-4 pr-6 text-right">Administrative Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {staff.map((member) => (
                                    <tr key={member.staff_id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 pl-6 font-semibold text-gray-900">
                                            {member.name} {member.surname}
                                        </td>
                                        <td className="p-4 font-medium text-gray-600">{member.email_account}</td>
                                        <td className="p-4">
                                            {member.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                    <ShieldAlert className="h-3 w-3" /> System Administrator
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                    <Users className="h-3 w-3" /> Standard Staff
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {/* Edit Icon Trigger */}
                                                <button onClick={() => openEdit(member)} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-100" title="Edit Profile">
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                {/* Delete Action Trigger */}
                                                <button onClick={() => handleDelete(member.staff_id, member.name, member.surname)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" title="Delete Profile Permanently">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {staff.length === 0 && (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            No team profiles found. Populate internal records using the creator button above.
                        </div>
                    )}
                </div>

                {/* CREATE MODAL */}
                <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) reset(); }}>
                    <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <DialogHeader>
                            <DialogTitle className="text-[#2d1b4e] text-lg font-bold">Register New Staff Profile</DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm">Create internal accounts for cargo handlers or managers.</DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">First Name</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Surname</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.surname} onChange={e => setData('surname', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Email Account Reference</label>
                                <input type="email" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.email_account} onChange={e => setData('email_account', e.target.value)} required />
                                {errors.email_account && <p className="text-red-500 text-xs mt-1">{errors.email_account}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">System Security Role</label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.role} onChange={e => setData('role', e.target.value)}>
                                    <option value="staff">Standard Staff</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Login Password</label>
                                <input type="password" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min 6 characters" required />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); reset(); }} className="text-gray-700 bg-white hover:bg-gray-50 text-xs px-5">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white text-xs px-5">
                                    {processing ? 'Registering...' : 'Register Account'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* EDIT MODAL */}
                <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditingStaff(null); reset(); } }}>
                    <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <DialogHeader>
                            <DialogTitle className="text-[#2d1b4e] text-lg font-bold">Modify Staff Parameters</DialogTitle>
                            <DialogDescription className="text-gray-500 text-sm">Update credential attributes or shift access clearances.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">First Name</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Surname</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.surname} onChange={e => setData('surname', e.target.value)} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Email Account Reference</label>
                                <input type="email" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.email_account} onChange={e => setData('email_account', e.target.value)} required />
                                {errors.email_account && <p className="text-red-500 text-xs mt-1">{errors.email_account}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">System Security Role</label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.role} onChange={e => setData('role', e.target.value)}>
                                    <option value="staff">Standard Staff</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Update Password</label>
                                <input type="password" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white !text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e85d04]/20 focus:border-[#e85d04]" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Leave blank to keep current" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditingStaff(null); reset(); }} className="text-gray-700 bg-white hover:bg-gray-50 text-xs px-5">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white text-xs px-5">
                                    {processing ? 'Saving changes...' : 'Update Details'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}