import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
    FaArrowRight,
    FaGlobeAfrica,
    FaChartLine,
    FaBuilding,
} from "react-icons/fa";

export default function Hero() {
    useGSAP(() => {
        const tl = gsap.timeline();

        // Reveal background ambient elements first
        gsap.fromTo(".bg-glow-element",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
        );

        tl.from(".hero-badge", {
            opacity: 0,
            y: -20,
            duration: 0.6,
        })
            .from(".hero-title-line", {
                opacity: 0,
                y: 60,
                stagger: 0.12,
                duration: 0.85,
                ease: "power4.out",
            }, "-=0.3")
            .from(".hero-description", {
                opacity: 0,
                y: 20,
                duration: 0.6,
            }, "-=0.4")
            .from(".hero-actions", {
                opacity: 0,
                y: 15,
                duration: 0.5,
            }, "-=0.4")
            .from(".hero-image-wrapper", {
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            .from(".floating-card", {
                opacity: 0,
                scale: 0.85,
                y: 20,
                stagger: 0.15,
                duration: 0.6,
                ease: "back.out(1.4)",
            }, "-=0.3");

        // Unified looping pulse animation for ambient glows
        gsap.to(".africa-glow", {
            scale: 1.15,
            opacity: 0.6,
            repeat: -1,
            yoyo: true,
            duration: 4,
            ease: "sine.inOut"
        });
    });

    return (
        <section className="relative px-4 py-16 md:py-24 lg:px-8 min-h-screen overflow-hidden flex items-center bg-[#050505] text-white">

            {/* Background Lighting Graphics */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <div className="africa-glow bg-glow-element absolute right-[-10%] top-[10%] md:right-[5%] w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full bg-yellow-400/5 blur-[100px] md:blur-[160px]" />
                <div className="bg-glow-element absolute left-[-10%] bottom-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-500/5 blur-[100px] md:blur-[160px]" />
            </div>

            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

                {/* Left Text Block */}
                <div className="lg:col-span-7 flex flex-col items-start text-left">
                    <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-400 uppercase tracking-[3px] text-[10px] sm:text-xs font-semibold">
                        <FaGlobeAfrica className="text-sm" />
                        Pan African Advisory
                    </div>

                    <h1 className="hero-title mt-6 sm:mt-8 text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] text-white">
                        <span className="hero-title-line block">Transforming</span>
                        <span className="hero-title-line block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                            Businesses
                        </span>
                        <span className="hero-title-line block">Across Africa</span>
                    </h1>

                    <p className="hero-description mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-stone-400 leading-relaxed max-w-2xl">
                        Executive-level strategy, digital transformation, and market
                        expansion solutions built from decades of leadership across fintech,
                        telecommunications, and global brands.
                    </p>

                    <div className="hero-actions flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
                        <button className="px-8 py-4 sm:py-5 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center gap-3 hover:bg-yellow-300 active:scale-98 transition transform duration-200 shadow-lg shadow-yellow-400/10">
                            Start A Conversation
                            <FaArrowRight className="text-sm" />
                        </button>

                        <button className="px-8 py-4 sm:py-5 rounded-full border border-white/15 text-white font-medium hover:bg-white/5 active:scale-98 transition">
                            View Expertise
                        </button>
                    </div>
                </div>

                {/* Right Interactive Image Layer */}
                <div className="lg:col-span-5 relative w-full max-w-md lg:max-w-none mx-auto mt-8 lg:mt-0 px-4 sm:px-10 lg:px-0">
                    <div className="hero-image-wrapper relative rounded-[40px] sm:rounded-[50px] overflow-hidden border border-white/10 bg-stone-900 shadow-2xl">
                        <img
                            src="/images/maurice.jpg"
                            alt="Maurice - Executive Consultant"
                            className="w-full h-[380px] sm:h-[480px] lg:h-[540px] object-cover object-top filter grayscale contrast-110 brightness-90 hover:grayscale-0 transition-all duration-700"
                        />
                        {/* Shadow grading Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>

                    {/* Floating Performance Indicator Metrics Card */}
                    <div className="floating-card absolute -left-2 sm:-left-6 bottom-8 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 w-56 sm:w-64 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-yellow-400 text-black flex items-center justify-center text-xl sm:text-2xl shrink-0">
                                <FaChartLine />
                            </div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">25+</h3>
                                <p className="text-xs sm:text-sm text-stone-400 font-medium">Years Experience</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Portfolio Brand Placement Card */}
                    <div className="floating-card absolute -right-2 sm:-right-6 top-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl max-w-[210px] sm:max-w-[240px]">
                        <div className="flex items-start gap-3">
                            <FaBuilding className="text-yellow-400 text-2xl sm:text-3xl shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-white">Global Brands</h4>
                                <p className="text-[11px] sm:text-xs text-stone-400 leading-normal mt-1 font-medium">
                                    Visa &bull; Airtel &bull; Coca-Cola
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}