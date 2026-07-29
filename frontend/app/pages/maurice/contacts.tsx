import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaBuilding, FaRegCheckCircle } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                {/* Left Information Anchor */}
                <div className="lg:col-span-5 space-y-8">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15">
                            Engagement Hub
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-4 mb-4 leading-none">
                            Initiate <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200">Consultation</span>
                        </h1>
                        <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-sm">
                            Connect directly with Maurice Advisory to explore strategic cross-border capabilities, payment infrastructure design, or corporate restructuring.
                        </p>
                    </div>

                    <div className="space-y-4 text-sm font-medium text-stone-300">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-950/40 border border-stone-900 max-w-sm">
                            <FaEnvelope className="text-amber-400 text-base" />
                            <a href="mailto:mnewa@mauriceadvisory.com" className="hover:text-amber-400 transition">mnewa@mauriceadvisory.com</a>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-950/40 border border-stone-900 max-w-sm">
                            <FaPhoneAlt className="text-amber-400 text-sm" />
                            <span className="text-stone-400">Secure Boardroom Line Available via Email</span>
                        </div>
                    </div>

                    <div className="border-t border-stone-900 pt-6 max-w-sm space-y-3">
                        <div className="flex items-start gap-3 text-xs text-stone-500">
                            <FaRegCheckCircle className="text-amber-500 mt-0.5 shrink-0" />
                            <span>Direct personal review of all corporate intake briefs by Senior Partners within 24 business hours.</span>
                        </div>
                        <div className="flex items-start gap-3 text-xs text-stone-500">
                            <FaRegCheckCircle className="text-amber-500 mt-0.5 shrink-0" />
                            <span>Fiduciary nondisclosure and preliminary conflict checks executed prior to foundational discovery.</span>
                        </div>
                    </div>
                </div>

                {/* Right Executive Qualification Form Component */}
                <div className="lg:col-span-7 bg-stone-950/40 border border-stone-900 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                    <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-xl font-bold tracking-tight mb-2 text-white">Engagement Intake Form</h2>
                    <p className="text-stone-500 text-xs mb-8">Please provide complete organizational parameters to guarantee precise initial briefing readiness.</p>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Corporate Entity Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 transition"
                                    placeholder="e.g., Enterprise Ltd"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Primary Mandate Scope</label>
                                <select className="w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 transition appearance-none">
                                    <option>Digital Infrastructure / Fintech</option>
                                    <option>Pan-African Market Entry & Scaling</option>
                                    <option>Corporate Turnaround & M&A</option>
                                    <option>Board Advisory / Executive Support</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Executive Officer Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 transition"
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Corporate Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 transition"
                                    placeholder="executive@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Operational Scope & Current Strategic Challenge Brief</label>
                            <textarea
                                rows={4}
                                className="w-full bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/40 transition resize-none"
                                placeholder="Detail localized parameters, target geographies, and primary operational bottlenecks..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-linear-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:from-amber-300 hover:to-amber-400 active:scale-98 transition transform duration-150 mt-4 shadow-lg shadow-amber-500/5"
                        >
                            Submit Enterprise Briefing Form
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}