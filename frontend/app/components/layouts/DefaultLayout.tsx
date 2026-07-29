import type { ReactNode } from "react";
import DefaultLoader from "./DefaultLoader";
import DefaultNav from "./DefaultNavbar";
import DefaultSidebar from "./DefaultSidebar";
import { AuthProvider, useAuth } from '~/context/AuthContext';


interface ArtistLayoutProps {
    children: ReactNode;
}

const DefaultLayoutContent: React.FC<ArtistLayoutProps> = ({ children }) => {
    const { user, loading, logout } = useAuth();

    // if (loading) {
    //     return <DefaultLoader />
    // }
    // if (!user) {
    //     if (typeof window !== "undefined") window.location.href = "/login";
    //     return null;
    // }

    return (

        <>
            {/* <DefaultNav />{preHandler: authenticate }, */}
            <div className="w-full h-full bg-no-repeat bg-cover bg-[url('/images/x.jpg')] md:mt-0 p-0">
                <div className="backdrop-blur-lg bg-white/40 dark:bg-[#0f0f0f94] shadow-2 shadow-[#b1b0b0] dark:shadow-none h-full w-full  flex flex-row justify-between ">
                    <DefaultSidebar />
                    {/* Main */}
                    <div className="relative backdrop-blur-lg h-full pb-4 w-full md:w-[85%]  flex flex-col md:rounded-tl-[30px] rounded-bl-[30px]">

                        {/* main content */}
                        <div className="flex justify-around h-full w-full overflow-hidden">
                            {children}


                        </div>
                    </div>
                </div>
            </div>
        </>

    );

}

const DefaultLayout: React.FC<ArtistLayoutProps> = ({ children }) => {

    return (
        <AuthProvider>
            <DefaultLayoutContent>
                {children}
            </DefaultLayoutContent>

        </AuthProvider>
    );
}

export default DefaultLayout;
