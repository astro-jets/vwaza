import React from 'react';
import {
    FaGlobeAfrica,
    FaLinkedinIn,
    FaTwitter,
    FaEnvelope,
    FaArrowRight
} from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const linksCompany = ['About Maurice', 'Pan-African Expertise', 'Case Studies', 'Insights'];
    const linksServices = ['Executive Advisory', 'Digital Transformation', 'Market Expansion', 'Board Governance'];

    return (
        <footer className="relative w-full bg-[#050505] text-stone-300 border-t border-stone-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Structural Accent Top Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">

                {/* Brand Information Column */}
                <div className="lg:col-span-4 flex flex-col items-start">
                    <div className="flex items-center gap-2.5 font-black text-white text-lg tracking-wider uppercase">
                        <FaGlobeAfrica className="text-amber-400 text-xl" />
                        <span>Maurice <span className="text-amber-400">Advisory</span></span>
                    </div>
                    <p className="mt-4 text-sm text-stone-400 leading-relaxed max-w-sm">
                        Connecting global vision with local execution. Decades of operational leadership driving high-impact digital and strategic business transformation across emerging African markets.
                    </p>
                    <div className="flex items-center gap-3 mt-6">
                        <a href="#linkedin" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/40 transition duration-200">
                            <FaLinkedinIn className="text-sm" />
                        </a>
                        <a href="#twitter" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/40 transition duration-200">
                            <FaTwitter className="text-sm" />
                        </a>
                        <a href="mailto:contact@maurice.com" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/40 transition duration-200">
                            <FaEnvelope className="text-sm" />
                        </a>
                    </div>
                </div>

                {/* Dynamic Column Link Systems */}
                <div className="lg:col-span-2 sm:col-span-1">
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Firm</h4>
                    <ul className="space-y-2.5 text-sm">
                        {linksCompany.map((item, idx) => (
                            <li key={idx}>
                                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-stone-400 hover:text-amber-400 transition duration-150">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-2 sm:col-span-1">
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Expertise</h4>
                    <ul className="space-y-2.5 text-sm">
                        {linksServices.map((item, idx) => (
                            <li key={idx}>
                                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-stone-400 hover:text-amber-400 transition duration-150">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Premium Newsletter Hub Column */}
                <div className="lg:col-span-4 md:col-span-2">
                    <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Pan-African Insights</h4>
                    <p className="text-sm text-stone-400 mb-4 max-w-sm">
                        Subscribe to receive periodic briefings on market expansion, regulatory landscapes, and digital ecosystems in Africa.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center w-full max-w-sm">
                        <input
                            type="email"
                            placeholder="Enter corporate email"
                            className="w-full px-4 py-3.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition duration-200 pr-12"
                            required
                        />
                        <button
                            type="submit"
                            aria-label="Subscribe"
                            className="absolute right-1.5 w-9 h-9 bg-amber-400 text-black rounded-lg flex items-center justify-center hover:bg-amber-300 transition duration-200 active:scale-95"
                        >
                            <FaArrowRight className="text-xs" />
                        </button>
                    </form>
                </div>

            </div>

            {/* Compliance / Copyright Sub-Footer Row */}
            <div className="max-w-7xl mx-auto border-t border-stone-900/60 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
                <div>
                    &copy; {currentYear} Maurice Advisory. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    <a href="#privacy" className="hover:text-stone-400 transition">Privacy Strategy</a>
                    <a href="#terms" className="hover:text-stone-400 transition">Terms of Engagement</a>
                </div>
            </div>
        </footer>
    );
}