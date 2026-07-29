import React, { useState } from 'react';
import { FaGlobeAfrica, FaChartLine, FaShieldAlt, FaArrowRight, FaFilter } from 'react-icons/fa';

const caseStudies = [
    {
        id: 1,
        sector: "Fintech & Payments",
        region: "Southern Africa Corridor",
        title: "National Payment Interoperability Framework",
        clientContext: "A Tier-1 regional banking consortium and mobile network operator ecosystem looking to bridge fragmented transactional rails.",
        challenge: "Incompatible clearing mechanics and high regulatory friction across multi-jurisdictional borders, leading to severe settlement latency and client acquisition churn.",
        intervention: "Deployed a unified transaction switching layout inspired by top-tier global networks. Restructured the risk mitigation protocols and coordinated directly with regulatory frameworks to secure fast clearing clearance.",
        metrics: [
            { label: "Settlement Latency", value: "-82%" },
            { label: "Transaction Velocity", value: "+310%" },
            { label: "Cross-Border Fee Friction", value: "-45%" }
        ]
    },
    {
        id: 2,
        sector: "Telecommunications",
        region: "West Africa (Nigeria)",
        title: "High-Scale Subscriber Market Entry Execution",
        clientContext: "A major multinational telecommunications network seeking rapid market penetration and distribution infrastructure scaling in a highly competitive sector.",
        challenge: "Complex localized regulatory compliance demands, fragmented supply chain mechanics, and intense competitive customer acquisition dynamics.",
        intervention: "Engineered an omnichannel Go-To-Market (GTM) distribution blueprint. Re-aligned field commercial structures and designed a data-driven targeted campaign built on deep consumer behavioral analytics.",
        metrics: [
            { label: "Market Share Gain", value: "+14.2%" },
            { label: "Active User Baseline", value: "22M+" },
            { label: "CAC Efficiency", value: "+38%" }
        ]
    },
    {
        id: 3,
        sector: "Corporate Restructuring",
        region: "East Africa (Kenya)",
        title: "Enterprise Commercial Turnaround & Synergy Extraction",
        clientContext: "A massive commercial network underperforming on legacy infrastructure with high operating cost overheads post-acquisition.",
        challenge: "Siloed operational units, redundant overhead pipelines, and dropping EBITDA margins across critical product categories.",
        intervention: "Executed a comprehensive enterprise structural audit utilizing advanced restructuring mechanics. Consolidated commercial reporting matrix layers, optimized supply channels, and deployed strict capital allocation frameworks.",
        metrics: [
            { label: "EBITDA Margin Lift", value: "+650 bps" },
            { label: "Opex Rationalization", value: "24% Saved" },
            { label: "Organizational Alignment", value: "100%" }
        ]
    }
];

export default function TrackRecordPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const sectors = ["All", "Fintech & Payments", "Telecommunications", "Corporate Restructuring"];

    const filteredCases = activeFilter === "All"
        ? caseStudies
        : caseStudies.filter(c => c.sector === activeFilter);

    return (
        <div className="bg-[#050505] text-white min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15">
                        Proven Mandates
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-4 mb-6 leading-none">
                        Validated Enterprise <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                            Impact Metrics
                        </span>
                    </h1>
                    <p className="text-stone-400 text-base sm:text-lg max-w-xl">
                        To ensure compliance with strict institutional NDAs, these case studies represent sanitized operational blueprints demonstrating our capability to execute multi-million dollar corporate turnarounds.
                    </p>
                </div>

                {/* Filter Navigation */}
                <div className="flex flex-wrap items-center gap-2 border-b border-stone-900 pb-6 mb-12">
                    <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider mr-4">
                        <FaFilter className="text-amber-500/80" /> Filter Mandates:
                    </div>
                    {sectors.map((sector, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveFilter(sector)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${activeFilter === sector
                                ? "bg-amber-400 text-black"
                                : "bg-stone-950 border border-stone-900 text-stone-400 hover:text-white hover:border-stone-800"
                                }`}
                        >
                            {sector}
                        </button>
                    ))}
                </div>

                {/* Case Studies Matrix */}
                <div className="space-y-12">
                    {filteredCases.map((study) => (
                        <div
                            key={study.id}
                            className="bg-gradient-to-b from-stone-950 to-[#090909] border border-stone-900 rounded-3xl p-6 sm:p-10 hover:border-stone-800 transition-all duration-300"
                        >
                            {/* Card Meta Top */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-900/60 pb-6 mb-8">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block">Industry Sector</span>
                                        <span className="text-sm font-bold text-amber-400">{study.sector}</span>
                                    </div>
                                    <div className="h-8 w-px bg-stone-900" />
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block">Jurisdiction</span>
                                        <span className="text-sm font-semibold text-stone-300 flex items-center gap-1.5">
                                            <FaGlobeAfrica className="text-stone-500 text-xs" /> {study.region}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs font-bold uppercase bg-stone-900 border border-stone-800 px-3 py-1 text-stone-400 rounded-lg">
                                    Fiduciary Grade Case Study
                                </div>
                            </div>

                            {/* Grid Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                                {/* Left Narrative Architecture */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                                            {study.title}
                                        </h2>
                                        <p className="text-stone-400 text-sm leading-relaxed italic">
                                            &ldquo;{study.clientContext}&rdquo;
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Systemic Challenge
                                            </h4>
                                            <p className="text-stone-400 text-sm leading-relaxed">{study.challenge}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Strategic Intervention
                                            </h4>
                                            <p className="text-stone-400 text-sm leading-relaxed">{study.intervention}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Metrics Scorecard */}
                                <div className="lg:col-span-4 bg-stone-950 border border-stone-900/80 p-6 rounded-2xl flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                                            <FaChartLine className="text-amber-500" /> Verified Delta Outcomes
                                        </h3>
                                        <div className="space-y-4">
                                            {study.metrics.map((m, idx) => (
                                                <div key={idx} className="border-b border-stone-900/60 pb-3 last:border-0 last:pb-0">
                                                    <span className="text-2xl font-black text-white tracking-tight block font-mono">
                                                        {m.value}
                                                    </span>
                                                    <span className="text-[11px] text-stone-400 font-medium tracking-wide">
                                                        {m.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full mt-8 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/20 text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-amber-400 rounded-xl flex items-center justify-center gap-2 transition duration-200">
                                        Request Strategy Deployment Brief <FaArrowRight className="text-[9px]" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Fiduciary Security Callout */}
                <div className="mt-16 p-6 rounded-2xl bg-stone-950/40 border border-stone-900 max-w-3xl mx-auto flex items-start gap-4">
                    <FaShieldAlt className="text-amber-500 text-xl mt-1 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Strict Conflict-of-Interest Screening</h4>
                        <p className="text-stone-500 text-xs leading-relaxed">
                            Maurice Advisory conducts comprehensive fiduciary conflict reviews before scheduling any organizational discovery calls. Full references and verified transactional outcomes are made accessible under comprehensive non-disclosure parameters.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}