"use client"
import {useState} from "react";

const Features = () => {

    const [activeIndex, setActiveIndex] = useState(1);

    // We have 5 items
    const items = [{
        id: 1,
        title: "No Spouse’s Signature Required",
        content: "Streamline your case with minimal delays or complications—no need to coordinate your spouse’s signature.",
        value: "20"
    }, {
        id: 2,
        title: "No Appointment Needed",
        content: "Walk in whenever it’s convenient for you. We understand your time is valuable, so our doors are open for you without the hassle of scheduling.",
        value: "40"
    }, {
        id: 3,
        title: "Mail-In Application",
        content: "Can’t come in person? No problem. Simply mail us your application and let us handle the rest—perfect for busy lifestyles.",
        value: "50"
    }, {
        id: 4,
        title: "Open 6 Days a Week",
        content: "We’re here to serve you almost every day, close to home. Choose the location that works best for your schedule.",
        value: "60"
    }, {
        id: 5,
        title: "Fast Turnaround",
        content: "Don’t get stuck in a drawn-out process. Our efficient system aims to wrap up your case within 6–8 weeks.",
        value: "70"
    }, {
        id: 6,
        title: "We Speak Your Language",
        content: "Communication shouldn’t be a barrier. Our team is fluent in Spanish, Portuguese, Hindi, Punjabi, and Bengali—so you can feel comfortable discussing your case.",
        value: "80"
    }, {
        id: 7,
        title: "Free Parking",
        content: "Enjoy hassle-free visits. Our offices offer complimentary parking, saving you time and money.",
        value: "90"
    },];
    return <div className={`mt-12 md:mt-16 lg:mt-24 w-full flex flex-col items-center h-full gap-8`}>
        <h1 className={`bg-orange-500 text-white px-4 font-semibold py-1.5 rounded-full lg:text-base text-sm  w-max`}>Why
            Choose Tri State Community Services</h1>
        <div className="w-full  hidden lg:flex">
            {items.map((item) => (<div
                key={item.id}
                // On mouse hover, expand this item
                onMouseEnter={() => setActiveIndex(item.id)}
                className={`${item.id === activeIndex ? "w-full bg-[#001a6e] text-white" : `w-max `} min-h-[450px]  border px-8 py-4 border-gray-300 rounded-3xl  overflow-hidden transition-all duration-200 flex flex-col`}
            >
                <div className=" font-semibold  flex-1 w-max">
                    {item.id}
                </div>

                {/* Content area: shown only if this item is activeIndex */}
                {activeIndex === item.id && (<div className=" my-12 flex-1">
                    {item.content}
                </div>)}
                <div>
                    <div
                        className={`[writing-mode:vertical-rl] rotate-180 text-clip max-w-[150px] font-semibold`}>{item.title}</div>
                </div>
            </div>))}
        </div>
        <div className="w-full flex flex-col gap-3 lg:hidden">
            {items.map((item) => (<div
                key={item.id}
                // On mouse hover, expand this item
                // onMouseEnter={() => setActiveIndex(item.id)}
                className={` w-full border px-4 py-4 border-gray-300 rounded-3xl  overflow-hidden transition-all duration-200 flex flex-col`}
            >
                <div className={` text-clip w-full font-bold text-base`}>{item.title}
                </div>
                <div className=" mt-2  text-sm">
                    {item.content}
                </div>
            </div>))}
        </div>
    </div>
}
export default Features;