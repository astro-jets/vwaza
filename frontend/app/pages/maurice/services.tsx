import React from 'react';
import { FaFingerprint, FaNetworkWired, FaSlidersH, FaCrown, FaUsersCog, FaArrowRight } from 'react-icons/fa';

const services = [
    {
        icon: <FaFingerprint className="text-amber-400 text-3xl" />,
        title: "Digital Transformation & Fintech Advisory",
        subtitle: "Payment Ecosystem Architecture",
        description: "Leveraging foundational infrastructure models from Visa Southern Africa and Vaya Technologies to architect secure, scalable transaction engines.",
        points: [
            "Mobile money & digital payment infrastructure scaling",
            "Legacy core banking to digital cloud stack migration",
            "Interoperability framework & regulatory clearing alignment"
        ]
    },
    {
        icon: <FaNetworkWired className="text-amber-400 text-3xl" />,
        title: "Pan-African Market Entry & Scaling Strategy",
        subtitle: "Cross-Border Commercial Execution",
        description: "Deploying direct, on-the-ground operational blueprints built from scaling Tier-1 operators across Nigeria, Kenya, and Namibia.",
        points: [
            "Sub-Saharan Africa regulatory navigation & risk mitigation",
            "Localized Go-To-Market (GTM) distribution blueprints",
            "Strategic local joint-venture & institutional sourcing"
        ]
    },
    {
        icon: <FaSlidersH className="text-amber-400 text-3xl" />,
        title: "Corporate Restructuring & Turnaround Management",
        subtitle: "Enterprise Value Optimization",
        description: "Applying institutional mechanics from Harvard, INSEAD, and LBS to stabilize underperforming entities and maximize EBITDA.",
        points: [
            "Post-merger integration (PMI) and structural change management",
            "Commercial efficiency audits & operating model redesign",
            "Capital allocation strategy & cost rationalization pipelines"
        ]
    },
    {
        icon: <FaCrown className="text-amber-400 text-3xl" />,
        title: "High-Tier Brand Equity & Consumer Insights",
        subtitle: "Data-Driven Market Dominance",
        description: "Translating elite enterprise systems from Unilever and Coca-Cola to establish market dominance for African corporate brands.",
        points: [
            "Emerging market quantitative consumer behavior analysis",
            "Corporate brand repositioning & premiumization strategy",
            "Omnichannel commercial deployment matrices"
        ]
    },
    {
        icon: <FaUsersCog className="text-amber-400 text-3xl" />,
        title: "Executive Coaching & Board-Level Advisory",
        subtitle: "Institutional Governance",
        description: "Serving as an independent boardroom advisor and strategic sounding board to Chief Executives and private equity committees.",
        points: [
            "Macroeconomic stress-testing & geographic hedge strategy",
            "Next-generation executive lineage & succession frameworking",
            "Corporate governance, compliance, and fiduciary architecture"
        ]
    }
];

export default function ServicesPage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15">
                        Capabilities Matrix
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-4 mb-6 leading-tight">
                        High-Value Institutional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-stone-200 to-amber-500">
                            Corporate Solutions
                        </span>
                    </h1>
                    <p className="text-stone-400 text-base sm:text-lg max-w-xl">
                        Premium corporate services optimized for complex cross-border expansion, digital payment integration, and major enterprise structural turnarounds.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                    {services.map((svc, idx) => (
                        <div key={idx} className="bg-stone-950/40 border border-stone-900 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 group">
                            <div>
                                <div className="mb-6 w-14 h-14 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/30 transition duration-300">
                                    {svc.icon}
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1 group-hover:text-amber-400 transition">
                                    {svc.title}
                                </h2>
                                <p className="text-xs font-semibold text-amber-500/80 uppercase tracking-widest mb-4">
                                    {svc.subtitle}
                                </p>
                                <p className="text-stone-400 text-sm leading-relaxed mb-6">
                                    {svc.description}
                                </p>
                                <ul className="space-y-2.5 border-t border-stone-900/60 pt-5 mb-8">
                                    {svc.points.map((pt, pIdx) => (
                                        <li key={pIdx} className="text-xs sm:text-sm text-stone-300 flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="w-full py-3.5 bg-stone-900 border border-stone-800 hover:border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-amber-400 flex items-center justify-center gap-2 transition">
                                Retain This Capability
                                <FaArrowRight className="text-[10px]" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}