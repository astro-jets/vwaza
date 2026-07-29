import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "stores/useCategoryStore";

type Category = {
    name: string;
    icon: React.ReactNode;
};

interface RadialMenuProps {
    showRadial: boolean;
    setShowRadial: (v: boolean) => void;
    categories: Category[];
}

export default function SwaggDonught({ showRadial, setShowRadial, categories }: RadialMenuProps) {
    const ringRef = useRef<HTMLDivElement>(null);
    // inside SwaggDonught
    const setCategory = useCategoryStore((state) => state.setCategory);
    const selectedCategory = useCategoryStore((state) => state.selectedCategory);
    return (
        <AnimatePresence>
            {showRadial && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-40 bg-linear-45 from-red-500/70 to-[#0000009c]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute top-0 inset-0 bg-black/40"
                        onClick={() => setShowRadial(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    />

                    {/* Donut Ring */}
                    <motion.div
                        ref={ringRef}
                        className="absolute top-40 w-[300px] h-[300px] flex items-center justify-center"
                        initial={{ scale: 0, rotate: 10 }}
                        animate={{ scale: 1, transition: { type: "spring", stiffness: 120, damping: 12 }, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10, transition: { type: "spring", duration: 0.6 } }}
                    >
                        <div className="absolute w-full h-full rounded-full border-[60px] border-white/80 dark:border-[#160d0ddc] shadow-xl" />

                        {/* Categories */}
                        {categories.map((cat, index) => {
                            const angle = (index / categories.length) * (2 * Math.PI);

                            const outerRadius = 150;       // half of 350px container
                            const borderThickness = 60;
                            const radius = outerRadius - borderThickness / 2; // middle of the border

                            const x = radius * Math.cos(angle);
                            const y = radius * Math.sin(angle);

                            return (
                                <button
                                    key={cat.name}
                                    className={`absolute flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg ${selectedCategory === cat.name ? 'bg-linear-45 from-[#ff4b0a2c] via-[#8b030325] to-[#00000023]  backdrop-blur-2xl' : ''}`}
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                        transform: `translate(${x - 32}px, ${y - 32}px)`,
                                        // -32 shifts by half button size (w-16 = 64px)
                                    }}
                                    onClick={() => {
                                        setCategory(cat.name);   // ✅ sets selected category
                                        setShowRadial(false);    // closes the radial
                                    }}
                                >
                                    <motion.div
                                        className="text-red-500 dark:text-white text-2xl"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.2 }}
                                    >
                                        {cat.icon}
                                    </motion.div>
                                    <span className="text-xs text-black dark:text-white">{cat.name}</span>
                                </button>
                            );
                        })}


                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
