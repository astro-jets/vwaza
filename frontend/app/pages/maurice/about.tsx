import React from 'react';
import { FaGraduationCap, FaNetworkWired, FaCheckCircle } from 'react-icons/fa';

export default function AboutPage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                {/* Left Side: Dynamic Profile Positioning */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-start">
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15 mb-4">
                        Founder Profile
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-6">
                        Maurice Newa
                    </h1>
                    <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-6">
                        Senior Managing Partner & Corporate Advisor
                    </p>
                    <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 mb-6 shadow-2xl relative">
                        <img
                            src="/images/maurice.jpg"
                            alt="Maurice Newa Portrait"
                            className="w-full h-full object-cover grayscale contrast-110 object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                </div>

                {/* Right Side: Credential Matrix */}
                <div className="lg:col-span-7 space-y-12">

                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight border-b border-stone-900 pb-3 mb-4">
                            Executive Profile
                        </h2>
                        <p className="text-stone-400 text-sm sm:text-base leading-relaxed mb-4">
                            Maurice Newa is an elite business leader with over 25 years of cross-border operational experience steering tier-one corporate infrastructure, scaling fintech models, and executing corporate transformations across complex Sub-Saharan African economies.
                        </p>
                        <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                            His career is characterized by structural mandate execution at the absolute highest tiers of commercial enterprise, providing global institutional funds, regional banks, and enterprise telecoms with an unmatched blueprint for localized corporate growth.
                        </p>
                    </div>

                    {/* Institutional Command Matrix */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight border-b border-stone-900 pb-3 mb-4 flex items-center gap-2">
                            <FaNetworkWired className="text-amber-400 text-base" /> Corporate Leadership Background
                        </h2>
                        <div className="space-y-4">
                            <div className="p-5 rounded-xl bg-stone-950/40 border border-stone-900">
                                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Fintech Sector</span>
                                <h3 className="font-bold text-base sm:text-lg text-white mt-1">Regional Managing Director &mdash; Visa (Southern Africa)</h3>
                                <p className="text-stone-400 text-xs sm:text-sm mt-1">Chaired the deployment of enterprise regional transactional value infrastructure and institutional central bank engagement operations.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-stone-950/40 border border-stone-900">
                                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Digital Infrastructure</span>
                                <h3 className="font-bold text-base sm:text-lg text-white mt-1">Chief Executive Officer &mdash; Vaya Technologies Ltd</h3>
                                <p className="text-stone-400 text-xs sm:text-sm mt-1">Oversaw digital solutions integration and product scaling matrices as a core subsidiary entity of the Econet Group network.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-stone-950/40 border border-stone-900">
                                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Telecommunications & Consumer Goods</span>
                                <h3 className="font-bold text-base sm:text-lg text-white mt-1">Executive Commercial Leadership</h3>
                                <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                                    Steered high-stakes commercial development portfolios for premier network providers and elite global fast-moving consumer goods networks:
                                </p>
                                <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-semibold text-stone-300">
                                    <div className="flex items-center gap-2"><FaCheckCircle className="text-amber-500 shrink-0" /> Airtel Nigeria</div>
                                    <div className="flex items-center gap-2"><FaCheckCircle className="text-amber-500 shrink-0" /> Safaricom Kenya</div>
                                    <div className="flex items-center gap-2"><FaCheckCircle className="text-amber-500 shrink-0" /> MTC Namibia</div>
                                    <div className="flex items-center gap-2"><FaCheckCircle className="text-amber-500 shrink-0" /> Unilever & Coca-Cola</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Educational Framework */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight border-b border-stone-900 pb-3 mb-4 flex items-center gap-2">
                            <FaGraduationCap className="text-amber-400 text-lg" /> Academic & Strategic Credentials
                        </h2>
                        <div className="p-5 rounded-xl bg-stone-950/40 border border-stone-900 space-y-4 text-xs sm:text-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">Advanced Executive Management Credentials</h4>
                                    <p className="text-stone-500 mt-0.5 font-medium">Harvard Business School &bull; INSEAD &bull; London Business School</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 border-t border-stone-900/80 pt-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-white">Bachelor of Arts: Economics & Social Science</h4>
                                    <p className="text-stone-500 mt-0.5 font-medium">University of Malawi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}