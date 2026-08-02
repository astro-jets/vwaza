

import { useEffect, useState, useRef } from "react";
import { FaMicrophone, FaTheaterMasks, FaUsers } from "react-icons/fa"
import { LiaUserAstronautSolid } from "react-icons/lia"
import { BsSoundwave, BsPeople, BsHeadphones, BsMusicNoteList } from "react-icons/bs";
import Player from "../Player/Player";
import { Link } from "react-router";

//GSAP
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from '@gsap/react'
import { BiCart, BiMoviePlay, BiShoppingBag } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import DarkModeSwitcher from "../themeMode/ThemeMode";
import { useAudioStore } from "stores/MusicStore";
import { useThemeStore } from "stores/ThemeStore";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);




const DefaultNav = () => {
    const setTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }
    }, [setTheme]);

    const [showPlayer, setShowPlayer] = useState(false)
    const { audio } = useAudioStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const tl = useRef<GSAPAnimation>(null);



    useGSAP(() => {

        const topLinks = document.querySelectorAll(".topLink")
        const navLinks = document.querySelectorAll(".navbar-item")
        if (isMenuOpen) {
            tl.current = gsap.timeline({ paused: true }).fromTo(topLinks,
                { y: -100 },
                { y: 0, duration: .4, ease: "power2.in", stagger: 0.1, delay: -0.5 }
            ).fromTo(navLinks, { x: -130 }, { x: 0, duration: 1, stagger: 0.1, ease: 'power4.in', delay: -1.6 })
        }

    }, [isMenuOpen]);


    useEffect(() => {
        console.log("Changed => ", tl)
        if (isMenuOpen) {
            tl.current?.play();
        } else { tl.current?.reverse() }
    }, [isMenuOpen])

    return (
        <>
            <div ref={containerRef} className="relative flex flex-col w-screen max-h-screen overflow-hidden z-999">
                {/* Menu */}
                {isMenuOpen &&
                    <div className={`links mobile-menu fixed z-999 left-0  bottom-0 backdrop-blur-lg bg-[#ffffff9d] dark:bg-[#000000d0] w-screen h-screen overflow-hidden scroll-m-0   ${isMenuOpen ? 'show' : 'close'}`} id="navmenu">
                        <div className="w-full grid grid-cols-3 mt-6 px-3">

                            <Link to={'/artists'} onClick={() => { setIsMenuOpen(false) }} className="topLink flex flex-col space-y-2 items-center">
                                <div className=" w-12 h-12 flex items-center justify-center py-2 px-4 rounded-2xl bg-white dark:bg-gray-950 shadow-xl  shadow-[#ff00005e]">
                                    <LiaUserAstronautSolid
                                        size={20}
                                        color="white"
                                        className="fill-black dark:fill-white" />
                                </div>
                                <p className="text-black dark:text-white text-xs">Profile</p>
                            </Link>

                            <Link to="/cart" onClick={() => { setIsMenuOpen(false) }} className="topLink flex flex-col space-y-2 items-center">
                                <div className=" w-12 h-12 flex items-center justify-center py-2 px-4 rounded-2xl bg-white dark:bg-gray-950 shadow-xl  shadow-[#ff00005e]">
                                    <BiCart
                                        size={30}
                                        color="white"
                                        className="fill-black dark:fill-white" />
                                </div>
                                <p className="text-black dark:text-white text-xs">Cart</p>
                            </Link>

                            <div className="topLink flex flex-col space-y-2 items-center justify-center">
                                <div className=" w-15 h-12 flex items-center justify-start py-2 rounded-2xl bg-white dark:bg-gray-950 shadow-xl  shadow-[#ff00005e]">
                                    <DarkModeSwitcher />
                                </div>
                                <p className="text-black dark:text-white text-xs">Theme</p>
                            </div>
                        </div>
                        <ul className="navbar-nav ms-auto space-y-6">
                            {[
                                { name: "Discover", icon: <FiSearch /> },
                                { name: "Albums", icon: <BsHeadphones /> },
                                { name: "Playlists", icon: <BsMusicNoteList /> },
                                { name: "Artists", icon: <FaUsers /> },
                                { name: "Events", icon: <FaTheaterMasks /> },
                                { name: "Podcasts", icon: <FaMicrophone /> },
                                { name: "Movies", icon: <BiMoviePlay /> },
                            ].map((item, index) => (
                                <li key={index} className="navbar-item" onClick={() => { setIsMenuOpen(false) }}>
                                    <Link to={`/${item.name.toLowerCase()}`} className="flex space-x-2 items-center text-black dark:text-white  py-2 px-4 rounded-lg w-4/5">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                {/* Nabar */}
                < div className="w-full z-9999 flex justify-center items-center fixed bottom-1">
                    <div className=" flex px-2 py-4 items-center justify-around backdrop-blur-lg shadow-sm shadow-red-500 bg-black/50   w-[98%] rounded-2xl h-15 ">

                        <div className="flex flex-col space-y-1  items-center" onClick={() => { setIsMenuOpen(false) }}>
                            <BiShoppingBag color="#fff" size={20} />
                            <Link to={{ pathname: '/market/' }} className="text-white text-xs">Market</Link>
                        </div>

                        <div className="flex flex-col space-y-1  items-center" onClick={() => { setIsMenuOpen(false) }}>
                            <BsSoundwave color="#fff" size={20} />
                            <Link to={'/'} className="text-white text-xs">Music</Link>
                        </div>

                        <div className="flex flex-col space-y-1  items-center" onClick={() => { setIsMenuOpen(false) }}>
                            <BsPeople color="#fff" size={20} className="mobile-menu-icon" />
                            <Link to={'/posts/'} className="text-white text-xs">Timeline</Link>
                        </div>


                        <div className={audio?.audio_url ? "flex flex-col space-y-1 items-center" : "hidden"}
                            onClick={() => { setShowPlayer(!showPlayer) }}
                        >
                            <img src={`/uploads/images/${audio?.cover_url!}`} className="w-12 h-12 rounded-full object-cover" />
                        </div>


                        <div className="flex flex-col items-center">

                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navmenu"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className={`icon ${isMenuOpen ? 'active' : ''}`} id="toggle">
                                    <div className="line line1"></div>
                                    <div className="line line2"></div>
                                    <div className="line line3"></div>
                                </span>
                            </button>
                        </div>

                        <div className="indicator"></div>
                    </div>
                </div>
                {/* Player */}
                <div className={`${showPlayer ? " relative h-full  mobile-menu w-full flex justify-center" : "hidden"}`}>
                    <div className={`bottom-0 top-0 h-screen  w-full md:w-[65%] flex items-start justify-start md:items-center md:justify-center ${showPlayer ? 'fixed ' : 'hidden'}`}>
                        <Player />
                    </div>
                </div>
            </div >

        </>
    );
};

export default DefaultNav;
