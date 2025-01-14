import Link from "next/link";
import {Button} from "@/components/ui/button";

const Page = () => {
    return <div className={`flex flex-col  justify-center items-center h-full`}>
        Dashboard

        <Button>
            <Link href="/intake-sheet">Intake-sheet</Link>
        </Button>
    </div>

}

export default Page;