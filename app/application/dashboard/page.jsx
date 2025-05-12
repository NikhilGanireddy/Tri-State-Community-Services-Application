"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import useMousePosition from "@/utils/cursor";
import {UserButton} from "@clerk/nextjs"; // Ensure this is returning correct clientX, clientY

const Page = () => {
    const {x, y} = useMousePosition();

    return (<div
        className=" relative overflow-x-hidden overflow-y-auto bg-fixed bg-cover bg-center h-full flex flex-col items-center justify-center bg-[url('/Wall2.jpg')] bg-white/20 min-h-screen">

        {/* Main Container */}
        <div
            className="w-[90%] max-w-[1600px] flex flex-col justify-center items-center p-8 rounded-3xl min-h-[90vh] shadow-2xl bg-white/10 h-full backdrop-blur-md">
            <Link href="/application/dashboard" className="text-xl md:text-5xl font-bold funnel-display-800">
                Tri State Community Services
            </Link>

            {/* Dashboard Title */}
            <h1 className="text-2xl font-extrabold text-gray-900 mt-4 funnel-display-600">Dashboard</h1>

            {/* Buttons Section */}
            <div className="flex w-full justify-center gap-6 mt-6">
                <Link href="/application/intake-sheet">
                <Button
                    className="py-4 rounded-lg px-6 text-md font-medium text-white bg-black shadow-md transition-all duration-300 hover:bg-gray-950 hover:shadow-lg">
                    <Link href="/application/intake-sheet">Intake Sheet</Link>
                </Button></Link>
                <Link href="/application/clients">
                    <Button
                        className="py-4 rounded-lg px-6 text-md font-medium text-white bg-black shadow-md transition-all duration-300 hover:bg-gray-950 hover:shadow-lg">
                        Clients
                    </Button></Link>
                <UserButton/>
            </div>
        </div>
    </div>);
};

export default Page;