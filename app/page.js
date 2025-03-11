import Navbar from "@/components/shared/Navbar";
import Heropage from "@/components/shared/Heropage";
import Features from "@/components/shared/Features";
import Testimonials from "@/components/shared/Testimonials";
import FAQ from "@/components/shared/FAQ";
import Disclaimer from "@/components/shared/Disclaimer";
import ContactLocationsPage from "@/components/shared/ContactLocationsPage";
import "../app/globals.css";
export default function Home() {
    return (<div className=" relative w-full min-h-screen flex flex-col h-full gap-6 px-4 m-8 max-w-[1200px] mx-auto">
        <Navbar/>
        <Heropage/>
        <Features/>
        <Testimonials/>
        <FAQ/>
        <Disclaimer/>
        <ContactLocationsPage/>
    </div>);
}