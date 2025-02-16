import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard | Tri State Community Services",
};

const Page = () => {
  return (
      <div className=" flex flex-col items-center justify-center bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md px-6 py-8">
        <Link href={"/"} className="text-3xl font-bold">
          Tri State Community Services
        </Link>

        {/* Dashboard Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4">Dashboard</h1>

        {/* Buttons Section */}
        <div className="flex w-full max-w-lg justify-center gap-6 mt-6">
          <Button className="py-4 rounded-lg px-6 text-lg font-medium bg-blue-600 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
            <Link href="/intake-sheet">Intake Sheet</Link>
          </Button>
          <Button className="py-4 rounded-lg px-6 text-lg font-medium bg-green-600 text-white shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg">
            <Link href="/clients">Clients</Link>
          </Button>
        </div>
      </div>
  );
};

export default Page;