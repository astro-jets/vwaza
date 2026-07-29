const DefaultSidebar = () => {
    return (
        < div className=" backdrop-blur-lg hidden md:flex flex-col space-y-8 py-4 px-4 w-[15%] h-screen " >
            <p className="text-3xl font-bold text-white">Studio <span className="text-red-500">X</span></p>
            <ul className="flex flex-col w-full items-center space-y-4">
                <li className="text-red-500 py-2 text-center w-11/12 rounded-[30px] backdrop-blur-lg bg-[#ffffff1c]">
                    Browse</li>
                <li className="text-gray-200 w-11/12">Songs</li>
                <li className="text-gray-200 w-11/12">Albums</li>
                <li className="text-gray-200 w-11/12">Artists</li>
            </ul>

        </div >
    );
}

export default DefaultSidebar;