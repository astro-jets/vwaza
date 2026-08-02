import React, { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { BiCartAdd } from "react-icons/bi";
import ItemSlider from "../sliders/ItemSlider/Item";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ItemModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [isMounted, setIsMounted] = useState(false);

    // 1. Client-Side Hydration Guard (Prevents React Router SSR mismatch)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 2. Lock page scroll safely when modal is open
    useEffect(() => {
        if (!isMounted || typeof window === "undefined") return;

        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isMounted]);

    if (!isMounted || !isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Dark Overlay Backdrop (Click outside to close) */}
            <div
                className="fixed inset-0 bg-black/80 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Box */}
            <div className="relative z-[10000] w-full max-w-xl max-h-[95vh] rounded-lg bg-slate-900 p-6 text-left shadow-xl transition-all overflow-y-auto">
                {/* Close Icon Button */}
                <button
                    onClick={onClose}
                    type="button"
                    aria-label="Close modal"
                    className="absolute right-3 top-3 cursor-pointer p-1 rounded-full text-white hover:bg-white/10 transition-colors z-10"
                >
                    <BsX size={30} />
                </button>

                {/* Item Slider Container */}
                <div className="py-10 flex items-center justify-center">
                    <div className="w-full">
                        <ItemSlider />
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center w-full">
                    <button
                        type="button"
                        className="flex justify-center bg-red-700 hover:bg-red-600 cursor-pointer rounded-2xl p-2 border-[3px] border-red-500 items-center w-3/4 transition-colors"
                    >
                        <BiCartAdd size={30} className="fill-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;