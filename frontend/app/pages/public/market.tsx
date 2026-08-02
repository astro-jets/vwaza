import { useRef, useState } from "react";

// Icons
import { BsEye, BsShop } from "react-icons/bs";
import { FaAngleDown, FaTshirt, FaShoppingBag, FaGlasses } from "react-icons/fa";
import { GiConverseShoe, GiTrousers } from "react-icons/gi";
import { BiCartAdd } from "react-icons/bi";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import CustomEase from "gsap/CustomEase";
import { PiBaseballCapFill, } from "react-icons/pi";
import { RiToolsLine } from "react-icons/ri";

import DefaultLoader from "~/components/layouts/DefaultLoader";
import SwaggDonught from "~/components/modals/SwaggDonught";
import ItemModal from "~/components/modals/ItemModal";
import { useCategoryStore } from "stores/useCategoryStore";
import DefaultLayout from "~/components/layouts/DefaultLayout";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

const Store = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showRadial, setShowRadial] = useState(false);
    const [displayItemSlider, setdisplayItemSlider] = useState(false);
    const selectedCategory = useCategoryStore((state: { selectedCategory: any; }) => state.selectedCategory);

    // useGSAP(() => {
    //     const items = gsap.utils.toArray<HTMLDivElement>(".shopItems");

    //     items.forEach((item) => {
    //         const shopItem = item.querySelectorAll(".shopItem");

    //         gsap.timeline({
    //             scrollTrigger: {
    //                 trigger: item,
    //                 start: "top 50%",
    //                 end: "bottom 70%",
    //                 scrub: 1,
    //             },
    //         }).fromTo(
    //             shopItem,
    //             { opacity: 0.7, scale: 0.8 },
    //             { opacity: 1, scale: 1, duration: 0.05, ease: "power2.in" }
    //         );
    //     });
    // }, []);


    // Fake products (replace with real data)
    const products = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        name: `Basic Tee ${index + 1}`,
        category: index % 2 === 0 ? "T-Shirts" : "Shoes", // example mapping
        price: "Mk15,000",
        image: `/images/clothes/c${index % 8 + 1}.jpg`,
    }));

    // Apply filter
    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category === selectedCategory)
        : products;


    const categories = [
        { name: "T-Shirts", icon: <FaTshirt /> },
        { name: "Shoes", icon: <GiConverseShoe /> },
        { name: "Hats", icon: <PiBaseballCapFill /> },
        { name: "Pants", icon: <GiTrousers /> },
        { name: "Bags", icon: <FaShoppingBag /> },
        { name: "Glasses", icon: <FaGlasses /> },
        { name: "Gadgets", icon: <RiToolsLine /> },
    ];

    return (
        <DefaultLayout>
            <>
                <DefaultLoader />

                <div className="flex flex-col h-screen overflow-y-scroll">
                    <div ref={containerRef} className="w-full h-full mx-auto px-4 lg:px-8  scroll-smooth">
                        <div className="typewriter flex justify-center items-center w-[67%] sm:w-full pt-6">
                            <h2 className="text-2xl font-thin tracking-tight text-black border-black dark:border-white dark:dark:text-white">
                                Welcome to the shop ...
                            </h2>
                        </div>

                        {/* Shops Button */}
                        <div
                            className="shadow-2 z-90 fixed shadow-[#b1b0b0] dark:shadow-none mt-4 w-30 max-w-35 justify-center items-center ml-auto flex space-x-2 backdrop-blur-lg dark:bg-[#0f0f0f5b] rounded-2xl p-1 cursor-pointer"
                            onClick={() => setShowRadial(!showRadial)}
                        >
                            <div className="p-2 rounded-2xl backdrop-blur-lg dark:bg-[#0f0f0f5b]">
                                {selectedCategory ? (
                                    categories.find(cat => cat.name === selectedCategory)?.icon
                                ) : (
                                    <BsShop size={15} color="red" />
                                )}
                            </div>

                            <p className="dark:text-white text-black font-light text-sm">
                                {selectedCategory ? selectedCategory : "All"}
                            </p>

                            <FaAngleDown color="white" size={15} />
                        </div>

                        {/* Radial Menu */}

                        <SwaggDonught categories={categories} setShowRadial={setShowRadial} showRadial={showRadial} />


                        <div className="scroll-smooth p-0 mt-16 gap-2.5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {
                                filteredProducts.map((item, index) => (
                                    <div key={index} className="shopItems overflow-hidden">
                                        <div
                                            key={index}
                                            className="shopItem group relative space-y-4 backdrop-blur-lg dark:bg-[#0f0f0f5b] bg-white/40 shadow-2 rounded-2xl p-2 py-4 mt-4"
                                        >
                                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-2xl lg:h-80" onClick={() => { setdisplayItemSlider(true) }}>
                                                <img
                                                    src={`/images/clothes/c${index % 8 + 1}.jpg`}
                                                    alt={item.image}
                                                    className="h-full w-full object-cover lg:h-full lg:w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full justify-center items-center">

                                                <h3 className="text-sm dark:text-white text-black">
                                                    {item.name}
                                                </h3>

                                                <p className="font-small text-sm text-red-500">{item.price}</p>

                                                <div className="flex space-x-4 mt-2 items-center justify-center">
                                                    <BiCartAdd
                                                        size={20}
                                                        className="fill-[red] dark:fill-[#f11f1f]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>



                    {displayItemSlider &&

                        <ItemModal isOpen={displayItemSlider} onClose={() => { setdisplayItemSlider(false) }} />
                    }
                </div>
            </>

        </DefaultLayout>
    );
};

export default Store;

