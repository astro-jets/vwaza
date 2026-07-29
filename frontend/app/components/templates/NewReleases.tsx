
const dummyAlbums = new Array(10).fill(0).map((_, i) => ({
    id: `a-${i}`,
    title: `Album ${i + 1}`,
    artist: `Artist ${i + 1}`,
    cover: `https://picsum.photos/seed/album-${i}/600/600`,
}));
const NewReleasesTemlpate = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-xl font-thin">New Releases</h2>
                <a className="text-sm text-red-600">See all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {dummyAlbums.slice(0, 6).map((al) => (
                    <div key={al.id} className="min-w-45 bg-white dark:bg-[#101010d8] backdrop-blur rounded-lg p-3 shadow-sm">
                        <img src={al.cover} alt={al.title} className="w-full h-40 object-cover rounded-md mb-2" />
                        <h3 className="text-sm font-semibold">{al.title}</h3>
                        <p className="text-xs text-gray-500">{al.artist}</p>
                    </div>
                ))}
            </div>
        </section>

    );
}

export default NewReleasesTemlpate;