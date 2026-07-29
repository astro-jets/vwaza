import { Link } from "react-router";
import {
    FaPlay,
    FaDownload,
    FaStar,
    FaFilm,
    FaSearch,
} from "react-icons/fa";
import DefaultLoader from "~/components/layouts/DefaultLoader";

export default function LandingPage() {
    return (
        <>
            <DefaultLoader />
            <div className="min-h-screen bg-black text-white">
                {/* NAVBAR */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-wide">
                        🇲🇼 MalawiFlix
                    </h1>

                    <nav className="hidden md:flex gap-6 text-sm text-gray-300">
                        <Link to="/">Home</Link>
                        <Link to="/movies">Movies</Link>
                        <Link to="/series">Series</Link>
                        <Link to="/downloads">Downloads</Link>
                    </nav>

                    <button className="bg-red-600 px-4 py-2 rounded-lg text-sm">
                        Sign In
                    </button>
                </header>

                {/* HERO */}
                <section className="relative h-[80vh] flex items-center px-6">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
                            className="w-full h-full object-cover opacity-40"
                        />
                    </div>

                    <div className="relative max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Stream & Download <br />
                            Malawian Movies
                        </h2>

                        <p className="text-gray-300 mt-4">
                            Discover local cinema, stories, drama, comedy and culture all in one place.
                        </p>

                        <div className="flex gap-4 mt-6">
                            <button className="flex items-center gap-2 bg-red-600 px-5 py-3 rounded-lg">
                                <FaPlay /> Watch Now
                            </button>

                            <button className="flex items-center gap-2 border border-white/30 px-5 py-3 rounded-lg">
                                <FaDownload /> Explore
                            </button>
                        </div>
                    </div>
                </section>

                {/* SEARCH BAR */}
                <div className="px-6 py-6">
                    <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 max-w-xl">
                        <FaSearch className="text-gray-400" />
                        <input
                            placeholder="Search movies..."
                            className="bg-transparent outline-none ml-3 w-full"
                        />
                    </div>
                </div>

                {/* CATEGORIES */}
                <section className="px-6">
                    <h3 className="text-xl font-semibold mb-4">Categories</h3>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {["Drama", "Comedy", "Action", "Romance", "Documentary"].map(
                            (cat) => (
                                <div
                                    key={cat}
                                    className="bg-white/10 p-4 rounded-xl text-center hover:bg-white/20 transition"
                                >
                                    <FaFilm className="mx-auto mb-2 text-red-500" />
                                    {cat}
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* TRENDING */}
                <section className="px-6 mt-10">
                    <h3 className="text-xl font-semibold mb-4">Trending Now</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white/10 rounded-xl overflow-hidden hover:scale-105 transition"
                                >
                                    <img
                                        src={`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?${i}`}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="p-3">
                                        <h4 className="font-semibold">Movie Title {i + 1}</h4>
                                        <p className="text-sm text-gray-400 flex items-center gap-1">
                                            <FaStar className="text-yellow-400" /> 4.{i + 2}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                {/* FEATURED BANNER */}
                <section className="px-6 mt-12">
                    <div className="relative rounded-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
                            className="w-full h-64 object-cover opacity-50"
                        />

                        <div className="absolute inset-0 flex items-center px-6">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Featured Malawian Film
                                </h2>
                                <p className="text-gray-300 mt-2 max-w-md">
                                    A powerful story of love, struggle, and ambition set in Malawi.
                                </p>

                                <button className="mt-4 bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2">
                                    <FaPlay /> Watch Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="mt-16 border-t border-white/10 px-6 py-8 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} MalawiFlix. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}