"use client"

import { BsX } from "react-icons/bs";
import { BiCartAdd } from "react-icons/bi";
import ItemSlider from "../sliders/ItemSlider/Item";

type modalProps = { isOpen: boolean, onClose: () => void };

const ItemModal = ({ isOpen, onClose }: modalProps) => {


    if (!isOpen) {
        return null;
    }


    return (

        <div className="fixed inset-0 z-9999">
            <div className="fixed inset-0  bg-black/90 bg-opacity-75 transition-opacity"></div>
            <div className="fixed top-0 bottom-0 inset-0 z-999  w-full">
                <div className="fixed overflow-y-hidden top-0 bottom-0 inset-0 max-h-[95vh] transform h-full rounded-lg text-left shadow-xl transition-all ">
                    <BsX size={30} onClick={onClose} className="mt-3 absolute right-2 fill-white" />
                    <div className="py-20 flex items-center justify-center lg:h-80">
                        <div className="w-full h-1/2">
                            <ItemSlider />
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <div className="flex justify-center bg-red-700 rounded-2xl p-2 border-3 border-red-500 items-center w-3/4">
                            <BiCartAdd
                                size={30}
                                className="fill-[red] dark:fill-[#ffffff]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemModal;