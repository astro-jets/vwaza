import {
    FaGlobeAfrica,
    FaUserTie,
    FaChartLine,
    FaLightbulb,
} from "react-icons/fa";

const reasons = [
    {
        title: "Pan-African Expertise",
        description:
            "Real-world executive experience across Southern, Eastern and Western Africa, helping businesses navigate diverse markets with confidence.",
        icon: <FaGlobeAfrica />,
    },
    {
        title: "Executive-Level Leadership",
        description:
            "Advice shaped by decades of leading multinational organisations—not just consulting from the sidelines.",
        icon: <FaUserTie />,
    },
    {
        title: "Results That Scale",
        description:
            "From digital transformation to commercial growth strategies, every engagement is focused on measurable business outcomes.",
        icon: <FaChartLine />,
    },
    {
        title: "Strategic Thinking",
        description:
            "Combining market intelligence, innovation and leadership to solve complex business challenges.",
        icon: <FaLightbulb />,
    },
];

export default function WhyUs() {
    return (
        <section className="py-36">

            <div className="max-w-7xl mx-auto px-8">

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div>

                        <p className="uppercase tracking-[8px] text-yellow-400 mb-5">

                            Why Choose Us

                        </p>

                        <h2 className="text-6xl font-black leading-tight">

                            Trusted Leadership.

                            <br />

                            Proven Strategy.

                            <br />

                            Sustainable Growth.

                        </h2>

                        <p className="mt-8 text-white/70 text-lg leading-9">

                            Businesses across Africa face increasingly complex
                            commercial, technological and operational challenges.

                            Our firm provides practical, executive-level guidance
                            grounded in decades of leadership across fintech,
                            telecommunications and multinational organisations.

                        </p>

                        <button className="mt-10 px-8 py-4 rounded-full bg-yellow-400 text-black font-bold hover:scale-105 transition">

                            Discover Our Approach

                        </button>

                    </div>

                    <div className="grid gap-6">

                        {reasons.map((reason) => (

                            <div
                                key={reason.title}
                                className="group flex gap-6 rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition duration-500"
                            >

                                <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition">

                                    {reason.icon}

                                </div>

                                <div>

                                    <h3 className="text-2xl font-bold">

                                        {reason.title}

                                    </h3>

                                    <p className="mt-3 text-white/60 leading-8">

                                        {reason.description}

                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </section>
    );
}