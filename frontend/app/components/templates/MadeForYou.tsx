
const dummyDiscover = new Array(8).fill(0).map((_, i) => ({
    id: `d-${i}`,
    title: `Studio X Mix ${i + 1}`,
    description: `Mood: Chill • ${10 + i} tracks`,
    cover: `https://picsum.photos/seed/discover-${i}/400/400`,
}));

const MadeForYouTemplate = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-xl font-thin">Made for You</h2>
                <a className="text-sm text-red-600">See all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {dummyDiscover.slice(0, 5).map((mix) => (
                    <div key={mix.id} className="min-w-45 bg-white dark:bg-[#101010d8] backdrop-blur rounded-lg p-3 shadow-sm">
                        <img src={mix.cover} alt={mix.title} className="w-full h-40 object-cover rounded-md mb-2" />
                        <h3 className="text-sm font-semibold">{mix.title}</h3>
                        <p className="text-xs text-gray-500">Personalized</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MadeForYouTemplate;