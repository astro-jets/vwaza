
const dummyArtists = new Array(6).fill(0).map((_, i) => ({
    id: `ar-${i}`,
    name: `Artist ${i + 1}`,
    cover: `https://picsum.photos/seed/artist-${i}/300/300`,
}));

const PopulartArtistsTemplate = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-xl font-thin">Popular Artists</h2>
                <a className="text-sm text-red-600">See all</a>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2">
                {dummyArtists.map((artist) => (
                    <div key={artist.id} className="min-w-30 text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2">
                            <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-medium">{artist.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default PopulartArtistsTemplate;
