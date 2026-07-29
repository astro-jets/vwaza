import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

// Geographically calibrated coordinate mapping relative to the 512x512 canvas
const locations = [
    { name: 'Nigeria', x: 175, y: 195, align: 'left' },
    { name: 'Kenya', x: 345, y: 220, align: 'right' },
    { name: 'Malawi', x: 335, y: 310, align: 'right' },
    { name: 'Namibia', x: 235, y: 375, align: 'left' },
];

const stats = [
    { value: '8', label: 'African Markets' },
    { value: '25+ Yrs', label: 'Leadership' },
    { value: 'Multiple', label: 'Industries' },
];

export default function AfricaVisualization() {
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Initial line draw reveal animation
            gsap.fromTo('.connection-line',
                { strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out', delay: 0.3 }
            );

            // 2. Infinite data flow animation moving along the dotted paths
            gsap.to('.connection-line', {
                strokeDashoffset: -20,
                duration: 2,
                repeat: -1,
                ease: 'none'
            });

            // 3. Infinite pulsing premium gold glow effect for location nodes
            gsap.to('.glow-circle', {
                scale: 2.5,
                opacity: 0,
                duration: 2,
                repeat: -1,
                ease: 'power1.out',
                stagger: { each: 0.3 }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto min-h-[620px] bg-[#050505] text-stone-100 rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col justify-between border border-stone-900 shadow-2xl"
        >
            {/* Golden Radial Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 max-w-2xl">
                <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-xs font-bold tracking-widest text-amber-400 bg-amber-400/5 px-3 py-1.5 rounded-full border border-amber-500/15"
                >
                    Pan-African Expertise
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black tracking-tight mt-5 mb-6 leading-tight"
                >
                    “I understand Africa because <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
                        I’ve operated across Africa.”
                    </span>
                </motion.h2>
            </div>

            {/* Main Visualization Area */}
            <div className="relative flex-1 w-full flex items-center justify-center min-h-[440px]">
                <svg
                    ref={svgRef}
                    viewBox="0 0 512 512"
                    className="w-full max-w-[440px] h-auto aspect-square z-10 filter drop-shadow-[0_0_30px_rgba(217,119,6,0.02)]"
                >
                    {/* Main Continent Shape & Madagascar */}
                    <g fill="#0c0a07" stroke="#2c2416" strokeWidth="2" strokeLinejoin="round">
                        {/* Mainland Africa */}
                        <path d="M201.56 19.495l-87.79 9.131-73.745 94.814v52.676l56.186 61.805 64.615-13.344 49.164 9.832-10.535 37.926 33.711 61.103-16.855 42.842 39.79 116.225 53.62-8.768 49.164-55.484 4.213-38.629 31.605-23.879-6.322-69.531 83.594-106.994-51.989 7.263-79.363-138.359-125.016-8.428-14.046-30.2z" />
                        {/* Madagascar */}
                        <path d="M453.906 339.295l-14.402 20.86-13.408.496c-11.849 24.321-12.598 38.019-13.907 66.547l17.383 4.471 21.852-52.147 2.482-40.226z" />
                    </g>

                    {/* Dotted Interconnected Network Lines Linked Sequentially */}
                    {locations.map((loc, index) => {
                        if (index === locations.length - 1) return null;
                        const nextLoc = locations[index + 1];
                        return (
                            <line
                                key={`line-${index}`}
                                className="connection-line stroke-amber-400/50"
                                strokeWidth="1.5"
                                strokeDasharray="6 4"
                                x1={loc.x}
                                y1={loc.y}
                                x2={nextLoc.x}
                                y2={nextLoc.y}
                            />
                        );
                    })}

                    {/* Core Location Nodes */}
                    {locations.map((loc, index) => (
                        <g key={`loc-${index}`}>
                            {/* Pulse Waves */}
                            <circle
                                cx={loc.x}
                                cy={loc.y}
                                r="8"
                                className="glow-circle fill-amber-400/20 pointer-events-none"
                                style={{ transformOrigin: `${loc.x}px ${loc.y}px` }}
                            />

                            {/* Node Anchor */}
                            <circle
                                cx={loc.x}
                                cy={loc.y}
                                r="4"
                                className="fill-amber-400 stroke-black stroke-[1.5]"
                            />

                            {/* Node Typography Labeling */}
                            <text
                                x={loc.x + (loc.align === 'right' ? 14 : loc.align === 'left' ? -14 : 0)}
                                y={loc.y + 4}
                                textAnchor={loc.align === 'right' ? 'start' : loc.align === 'left' ? 'end' : 'middle'}
                                className="fill-stone-300 font-bold text-[11px] tracking-wide select-none"
                            >
                                {loc.name}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* Bottom Metrics Section */}
            <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-stone-900/60 pt-8 mt-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                        className="text-center md:text-left"
                    >
                        <div className="text-2xl md:text-4xl font-black text-amber-400 tracking-tight">
                            {stat.value}
                        </div>
                        <div className="text-[10px] md:text-xs text-stone-500 mt-1 font-bold tracking-widest uppercase">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}