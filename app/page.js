'use client'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {UserButton} from "@clerk/nextjs";

export default function Home() {
    return (<div className="  flex flex-col items-center  bg-gradient-to-r from-blue-50 to-gray-100 text-gray-900 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
            Tri State Community Services
        </h1>

        <Button
            className="px-6 py-4 text-lg font-medium bg-blue-600 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
            <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        <div className="mt-6">
            <UserButton/>
        </div>


    </div>);
}