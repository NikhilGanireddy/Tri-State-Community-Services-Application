import Image from "next/image";
import Akash from "@/public/akash.jpg"
import TriState from "@/public/tristate.png"


const Heropage = () => {
    return <div className={` lg:mt-32 w-full h-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl gap-6`}>
        <div className={`grid grid-rows-1 w-full lg:grid-rows-2 gap-6 h-full lg:max-h-[600px] overflow-hidden`}>
            <div className={`relative w-full`}>
                <Image
                    src={TriState}
                    alt={"Tri State Community Services"}
                    className={`bg-blue-700 w-full relative backdrop-blur-md h-full overflow-hidden rounded-3xl object-cover aspect-auto`}
                    width={`160`} height={`90`}/>
                <div
                    className={`absolute left-0 top-0 px-4 py-5 bg-[#001A6E]/75 rounded-3xl w-full h-full  flex flex-col  text-white`}>
                    <h1 className={` text-xl md:text-2xl lg:text-4xl font-bold md:mt-4 mt-2 lg:mt-8 flex-1 `}>
                        Uncontested Divorce $399<span className={`text-xs`}> + Court Fee</span>
                    </h1>
                    <span className={` mt-2 text-base md:text-lg lg:text-2xl font-medium mb-2`}>Spouse's Signature Not Needed</span>
                    <p className={`md:mb-6 mb-3 lg:mb-8 text-sm font-light`}>
                        Walk in for unmatched, hassle-free divorce assistance—no online forms, speak directly to our
                        staff, and obtain a fast uncontested divorce in just 6–8 weeks.
                    </p>
                </div>
            </div>
            <div className={`w-full h-full grid grid-cols-2 gap-6 `}>
                <div className={`w-full h-full grid grid-rows-2 gap-6`}>
                    <div
                        className={`font-semibold  bg-[#001A6E]/30 rounded-3xl px-4 lg:px-6 py-5 flex flex-col justify-center items-center capitalize`}>
                        <span className={`text-xl lg:text-2xl font-bold`}>10,000+</span>
                        cases solved

                    </div>
                    <div
                        className={`font-semibold bg-[#001A6E] text-center text-white rounded-3xl px-6 py-5 flex flex-col justify-center items-center capitalize`}>
                        <span className={`text-xl lg:text-2xl font-bold`}>20+</span>
                        years experience
                    </div>
                </div>
                <div className={`w-full h-full grid grid-rows-2 gap-6`}>
                    <div
                        className={`font-semibold bg-[#001A6E]/60 rounded-3xl px-6 py-5 flex flex-col justify-center items-center capitalize`}>
                        <span className={`text-xl lg:text-2xl font-bold`}>6,000+</span>
                        happy clients
                    </div>
                    <div
                        className={`font-semibold text-  text-center bg-orange-500 rounded-3xl px-6 text-white py-5 flex flex-col justify-center items-center capitalize`}>
                        Ask a Query
                    </div>
                </div>
            </div>
        </div>
        <div className={` hidden lg:flex w-full h-full max-h-[600px]`}>
            <Image
                src={Akash}
                alt={"Akash Khurana"} className={`w-full h-full overflow-hidden rounded-3xl object-cover object-top `}
            />
        </div>
    </div>
}

export default Heropage;