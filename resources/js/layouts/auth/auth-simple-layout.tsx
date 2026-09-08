import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#2d1b4e] via-[#4a1a6b] to-[#6b1a4a] p-6 md:p-10">
            {/* Decorative circles */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#f5a623] opacity-10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#e85d04] opacity-10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-2xl backdrop-blur-sm">
                    {/* Top color bar */}
                    <div className="h-2 bg-gradient-to-r from-[#f5a623] via-[#e85d04] to-[#f5a623]" />

                    <div className="flex flex-col gap-8 p-8">
                        {/* Logo & Title */}
                        <div className="flex flex-col items-center gap-5">
                            <Link href={route('home')} className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#2d1b4e] shadow-lg ring-4 ring-[#f5a623]/30 transition-all group-hover:ring-[#f5a623]/60">
                                    <img 
                                        src="/images/logo.jpg" 
                                        alt="Hermes Logo" 
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold text-[#2d1b4e]">{title}</h1>
                                <p className="text-center text-sm text-gray-500">{description}</p>
                            </div>
                        </div>

                        {/* Form content */}
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-white/60">
                    Hermes Platform — Delivering Excellence
                </p>
            </div>
        </div>
    );
}