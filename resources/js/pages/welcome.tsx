import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Hermes Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=fraunces:400,500,600|public-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#f8f6fb] [font-family:'Public_Sans',sans-serif]">
                {/* Nav */}
                <header>
                    <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 lg:px-10">
                        <Link href="/" className="flex min-w-0 items-center gap-3">
                            <img src="/images/LOGO.jpg" alt="" className="h-9 w-9 shrink-0 rounded-full" />
                            <span className="truncate text-lg font-medium tracking-tight whitespace-nowrap text-[#2d1b4e] [font-family:'Fraunces',serif]">
                                Hermes Platform
                            </span>
                        </Link>
                        <div className="flex shrink-0 items-center gap-4 text-sm sm:gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-[#2d1b4e] px-5 py-2 font-medium whitespace-nowrap text-white transition-colors hover:bg-[#241541]"
                                >
                                    Go to dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="font-medium whitespace-nowrap text-[#2d1b4e]/70 transition-colors hover:text-[#2d1b4e]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-[#2d1b4e] px-5 py-2 font-medium whitespace-nowrap text-white transition-colors hover:bg-[#241541]"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#2d1b4e] to-[#1f1338]">
                    <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-28">
                        {/* Copy */}
                        <div className="starting:translate-y-3 starting:opacity-0 translate-y-0 opacity-100 transition-all duration-700">
                            <h1
                                className="text-4xl leading-[1.1] font-medium text-white sm:text-5xl lg:text-[3.4rem]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Every parcel
                                <br />
                                finds its way.
                            </h1>
                            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70">
                                Hermes Platform replaces the sign-in sheets and shared spreadsheets the campus courier office used to run
                                on. Log a parcel once, and follow it from drop-off to collection.
                            </p>
                            <div className="mt-9 flex flex-wrap items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#2d1b4e] transition-colors hover:bg-[#e09520]"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-full bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#2d1b4e] transition-colors hover:bg-[#e09520]"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/50"
                                        >
                                            Create account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Route graphic */}
                        <div className="relative mx-auto aspect-square w-full max-w-sm">
                            <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" aria-hidden="true">
                                <path
                                    id="hermes-route"
                                    d="M40 340 C 120 340, 100 220, 180 210 S 280 120, 260 60"
                                    stroke="#f5a623"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    pathLength={100}
                                    className="hermes-route-line"
                                />
                                <circle cx="40" cy="340" r="5" fill="#f5a623" />
                                <circle cx="180" cy="210" r="5" fill="#f5a623" opacity="0.8" />
                                <circle cx="260" cy="60" r="5" fill="#f5a623" opacity="0.55" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#2d1b4e] ring-4 ring-[#f5a623]/25 sm:h-32 sm:w-32">
                                    <img src="/images/LOGO.jpg" alt="Hermes Platform" className="h-full w-full rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
                    <div className="grid gap-10 sm:grid-cols-3">
                        <div>
                            <h3 className="text-base font-semibold text-[#2d1b4e]">Parcel management</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#4a4458]">
                                Log, search, and update parcels from the moment they arrive to the moment they're collected.
                            </p>
                        </div>
                        <div className="sm:border-l sm:border-[#2d1b4e]/10 sm:pl-10">
                            <h3 className="text-base font-semibold text-[#2d1b4e]">Courier management</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#4a4458]">
                                Keep an up-to-date record of every courier the office works with.
                            </p>
                        </div>
                        <div className="sm:border-l sm:border-[#2d1b4e]/10 sm:pl-10">
                            <h3 className="text-base font-semibold text-[#2d1b4e]">Automated notifications</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#4a4458]">
                                Recipients hear that their parcel is ready the moment its status changes — no phone calls needed.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#2d1b4e]/10 px-6 py-8 lg:px-10">
                    <p className="text-xs text-[#4a4458]/70">Hermes Platform — built for the campus courier office.</p>
                </footer>
            </div>

            <style>{`
                .hermes-route-line {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: hermes-draw-route 1.4s ease-out 0.3s forwards;
                }
                @keyframes hermes-draw-route {
                    to { stroke-dashoffset: 0; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .hermes-route-line {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </>
    );
}
