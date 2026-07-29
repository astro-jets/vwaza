import React from 'react';
import { FaFileInvoiceDollar, FaRegClock, FaArrowRight } from 'react-icons/fa';

const briefs = [
    {
        tag: "Fintech Strategy",
        title: "The Architecture of Pan-African Interoperability",
        excerpt: "An operational breakdown of current digital payment processing friction points across Sub-Saharan banking matrix integrations, and structural mitigation strategies for enterprise networks.",
        readTime: "9 min read"
    },
    {
        tag: "Market Entry",
        title: "Succeeding in High-Scale Emerging Jurisdictions",
        excerpt: "Analyzing regulatory risk frameworks and consumer distribution nuances between the telecom landscapes of Nigeria, Kenya, and Namibia to secure structural market entrenchment.",
        readTime: "12 min read"
    },
    {
        tag: "Enterprise Turnaround",
        title: "The Post-Merger Integration Playbook for Cross-Border Telecoms",
        excerpt: "Fiduciary frameworks and commercial design principles for managing complex human capital restructuring and system synergy extraction post-transaction.",
        readTime: "8 min read"
    }
];

export default function InsightsPage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-16">
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15">
                        Executive Briefings
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-4 mb-4">
                        Macro Knowledge & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Market Intelligence</span>
                    </h1>
                    <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                        Strategic viewpoints on fintech ecosystems, regulatory compliance, operational optimization, and cross-border commercial execution in Sub-Saharan Africa.
                    </p>
                </div>

                {/* Highlight Featured Intel Slot */}
                <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-10 mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                            <FaFileInvoiceDollar /> Featured Whitepaper
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
                            Navigating Cross-Border Fintech Frameworks: Scaling Payments across Sub-Saharan Africa
                        </h2>
                        <p className="text-stone-400 text-sm leading-relaxed mb-4">
                            This operational whitepaper outlines systemic risk mitigation models for multinational enterprise networks seeking transactional market penetration into emerging regional corridors.
                        </p>
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
                            <FaRegClock /> 18 Min Strategic Blueprint
                        </div>
                    </div>
                    <button className="whitespace-nowrap px-6 py-4 bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-amber-300 transition shrink-0 w-full lg:w-auto justify-center">
                        Download Intelligence
                        <FaArrowRight />
                    </button>
                </div>

                {/* Secondary Intel List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {briefs.map((brief, idx) => (
                        <div key={idx} className="bg-stone-950/60 border border-stone-900/80 rounded-2xl p-6 flex flex-col justify-between hover:border-stone-800 group transition">
                            <div>
                                <span className="text-[11px] font-bold tracking-widest uppercase text-amber-500/80 block mb-3">
                                    {brief.tag}
                                </span>
                                <h3 className="text-lg font-bold tracking-tight text-stone-100 mb-3 group-hover:text-amber-400 transition duration-200">
                                    {brief.title}
                                </h3>
                                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-6">
                                    {brief.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-stone-900/60 pt-4 mt-2">
                                <span className="text-xs text-stone-500 font-medium">{brief.readTime}</span>
                                <a href="#read" className="text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-amber-400 flex items-center gap-1 transition">
                                    Read Brief <FaArrowRight className="text-[9px]" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}