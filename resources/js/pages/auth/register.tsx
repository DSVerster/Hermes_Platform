import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-5">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[#2d1b4e] font-medium">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="John Doe"
                                className="pl-10 border-gray-200 focus:border-[#f5a623] focus:ring-[#f5a623]/20"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#2d1b4e] font-medium">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                                className="pl-10 border-gray-200 focus:border-[#f5a623] focus:ring-[#f5a623]/20"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-[#2d1b4e] font-medium">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Min. 8 characters"
                                className="pl-10 border-gray-200 focus:border-[#f5a623] focus:ring-[#f5a623]/20"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-[#2d1b4e] font-medium">Confirm password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Repeat password"
                                className="pl-10 border-gray-200 focus:border-[#f5a623] focus:ring-[#f5a623]/20"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-gradient-to-r from-[#f5a623] to-[#e85d04] hover:from-[#e09520] hover:to-[#d45404] text-white font-semibold shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40" 
                        tabIndex={5} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* Log in link */}
                <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="font-semibold text-[#e85d04] hover:text-[#f5a623]" tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}