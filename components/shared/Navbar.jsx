import Link from "next/link";
import { SignedIn, SignedOut } from '@clerk/nextjs';

const Navbar = () => {

    return <div className={`-mt-4 lg:-translate-x-4 lg:fixed lg:top-0 lg:mt-8 z-50 max-w-[1200px] backdrop-blur-sm w-full rounded-3xl px-6 py-5 flex justify-between items-center bg-[#001A6E]`}>
        <Link href={"/"} className={`text-base md:text-xl lg:text-2xl text-white font-bold`}>
            Tri State Community Services
        </Link>

        <SignedIn>
            <div className={`px-2 lg:px-8 py-2 rounded-xl bg-white  font-semibold
        `}>
                <Link href="/application/dashboard">
                    <button className="capitalize">dashboard</button>
                </Link>
            </div>

        </SignedIn>
        <SignedOut>
            {/* e.g. a button leading to /sign-in */}
        </SignedOut>

    </div>
}

export default Navbar;