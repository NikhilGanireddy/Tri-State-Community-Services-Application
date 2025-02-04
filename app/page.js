import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
      <div className="min-h-screen h-full">
        Tri State Community Services
        <Button>
        <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      </div>
  );
}
