const stats = [

    ["25+", "Years Experience"],

    ["8", "African Markets"],

    ["100+", "Business Transformations"],

    ["500M+", "Commercial Value"]

]

export default function Stats() {

    return (

        <section className="py-32">

            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 px-8">

                {

                    stats.map(([number, label]) => (

                        <div key={label}

                            className="rounded-3xl bg-white/5 border border-white/10 p-10 hover:bg-yellow-400 hover:text-black duration-500">

                            <h1 className="text-5xl font-black">

                                {number}

                            </h1>

                            <p className="mt-4 opacity-70">

                                {label}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    )

}