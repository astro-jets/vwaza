import {
    FaCcVisa,
    FaGlobe,
    FaBuilding,
} from "react-icons/fa";
import {
    SiCocacola,
    SiAirtel,
} from "react-icons/si";

const companies = [
    {
        name: "Visa",
        icon: <FaCcVisa />,
    },
    {
        name: "Airtel",
        icon: <SiAirtel />,
    },
    {
        name: "Safaricom",
        icon: <FaGlobe />,
    },
    {
        name: "Vaya Technologies",
        icon: <FaBuilding />,
    },
    {
        name: "Coca-Cola",
        icon: <SiCocacola />,
    },
];

export default function TrustedCompanies() {
    return (
        <section className="py-24 border-y border-white/10 bg-white/[0.02]">

            <div className="max-w-7xl mx-auto px-8">

                <p className="uppercase tracking-[8px] text-center text-yellow-400 text-sm">

                    Executive Experience

                </p>

                <h2 className="text-center text-5xl font-black mt-4">

                    Leadership Across Global Brands

                </h2>

                <p className="text-center text-white/60 mt-6 max-w-3xl mx-auto">

                    Maurice Newa has held senior leadership positions across
                    internationally recognized organizations spanning fintech,
                    telecommunications, technology and consumer goods.

                </p>

                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mt-20">

                    {companies.map((company) => (

                        <div
                            key={company.name}
                            className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-2 hover:bg-yellow-400 hover:text-black"
                        >

                            <div className="text-6xl mb-6">

                                {company.icon}

                            </div>

                            <h3 className="font-semibold text-lg">

                                {company.name}

                            </h3>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}