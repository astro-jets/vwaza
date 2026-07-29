import {

    FaGlobeAfrica,

    FaHandshake,

    FaRocket,

    FaCoins

} from "react-icons/fa";

const services = [

    {

        title: "Digital Transformation",

        icon: <FaCoins />,

        desc: "Helping organizations embrace digital innovation."

    },

    {

        title: "Market Expansion",

        icon: <FaGlobeAfrica />,

        desc: "Scaling businesses across Africa."

    },

    {

        title: "Executive Advisory",

        icon: <FaHandshake />,

        desc: "Strategic guidance for boards and CEOs."

    },

    {

        title: "Growth Strategy",

        icon: <FaRocket />,

        desc: "Commercial optimization for sustainable growth."

    }

]

export default function ServicesPreview() {

    return (

        <section className="py-32">

            <div className="max-w-7xl mx-auto px-8">

                <h2 className="text-5xl font-black mb-20">

                    Our Expertise

                </h2>

                <div className="grid lg:grid-cols-2 gap-8">

                    {

                        services.map(service => (

                            <div

                                key={service.title}

                                className="group rounded-[32px] p-10 border border-white/10 bg-white/5 hover:bg-yellow-400 hover:text-black duration-500">

                                <div className="text-5xl mb-8">

                                    {service.icon}

                                </div>

                                <h3 className="text-3xl font-bold">

                                    {service.title}

                                </h3>

                                <p className="mt-6 opacity-70">

                                    {service.desc}

                                </p>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    )

}