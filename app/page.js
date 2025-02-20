'use client'


import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
    return (<div className="  flex flex-col items-center justify-center w-screen h-full min-h-screen">
        This Page is currently under development. Please come back later
            <Link href={"/dashboard"}><Button className={`capitalize`}>dashboard</Button></Link>

    </div>);
}