"use client";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import useMousePosition from "@/utils/cursor";
import {UserButton} from "@clerk/nextjs"; // Ensure this is returning correct clientX, clientY

const Page = () => {
    const {x, y} = useMousePosition();

    return (<div
            className="cursor-none relative overflow-x-hidden overflow-y-auto bg-fixed bg-cover bg-center h-full flex flex-col items-center justify-center bg-[url('/Wall2.jpg')] bg-white/20 min-h-screen">

            {/* Custom Cursor Large Circle */}
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    x: x - 32, // Offset to center
                    y: y - 32, opacity: 1,
                }}
                transition={{type: "tween", ease: "backOut", duration: 0.3}}
                className="hidden md:inline-flex md:fixed md:w-16 md:h-16 md:border-[1px] md:border-black md:bg-transparent md:rounded-full md:z-50 pointer-events-none"
                style={{left: 0, top: 0, transform: "translate(-50%, -50%)"}}
            />

            {/* Custom Cursor Small Dot */}
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    x: x - 1, // Small offset for precision
                    y: y - 1, opacity: 1,
                }}
                transition={{type: "tween", ease: "backOut", duration: 0.1}}
                className="hidden md:inline-flex md:fixed md:w-2 md:h-2 md:bg-black md:rounded-full md:z-50 pointer-events-none"
                style={{left: 0, top: 0, transform: "translate(-50%, -50%)"}}
            />

            {/* Main Container */}
            <div
                className="w-[90%] max-w-[1600px] flex flex-col justify-center items-center p-8 rounded-3xl min-h-[90vh] shadow-2xl bg-white/10 h-full backdrop-blur-md">
                <Link href="/" className="text-xl md:text-5xl font-bold funnel-display-800">
                    Tri State Community Services
                </Link>

                {/* Dashboard Title */}
                <h1 className="text-2xl font-extrabold text-gray-900 mt-4 funnel-display-600">Dashboard</h1>

                {/* Buttons Section */}
                <div className="flex w-full justify-center gap-6 mt-6">
                    <Button
                        className="py-4 rounded-lg px-6 text-md font-medium text-white bg-black shadow-md transition-all duration-300 hover:bg-gray-950 hover:shadow-lg">
                        <Link href="/intake-sheet">Intake Sheet</Link>
                    </Button>
                    <Button
                        className="py-4 rounded-lg px-6 text-md font-medium text-white bg-black shadow-md transition-all duration-300 hover:bg-gray-950 hover:shadow-lg">
                        <Link href="/clients">Clients</Link>
                    </Button>
                    <UserButton/>
                </div>
            </div>
        </div>);
};

export default Page;