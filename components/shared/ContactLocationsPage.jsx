"use client"

import {Input} from "@/components/ui/input";
import {useState} from "react";
import { toast } from "sonner"


const ContactLocationsPage = () => {
    const [message, setMessage] = useState("");
    const [fName, setfName] = useState("");
    const [lName, setlName] = useState("");
    const [mobile, setmobile] = useState("");
    const [email, setemail] = useState("");


    const sendMessage = async (e) => {
        e.preventDefault(); // Prevents form submission and page reload

        const res = await fetch("/api/sendmessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, fName, lName, mobile, email }),
        });

        const data = await res.json();
        if (data.success) {
            toast.success("Successfully sent!");
            setMessage("");
            setfName("");
            setlName("");
            setmobile("");
            setemail("");
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return <div id={`ContactLocationsPage`} className={`my-12 md:my-16 lg:my-24 flex flex-col gap-6  py-5`}>
        <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold tracking-tighter px-6`}>Contact Us</h1>
        <div className={`w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 `}>
            <div className={`locations lg:mt-12 w-full flex flex-col gap-3 lg:gap-6 px-6 py-5`}>
                <div className={`py-4 rounded-3xl flex items-center gap-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-8 lg:size-10 lg:border lg:p-2  lg:rounded-xl">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
                    </svg>

                    <div>
                        <h1 className={`text-base md:text-lg  font-bold tracking-tighter`}>Chat with us Us</h1>
                        <h3 className={`text-sm md:text-base`}>Our friendly team is here to help</h3>
                        <a className={`text-sm md:text-base`} href={"mailto:tristatecommunityservices@gmail.com"}>tristatecommunityservices@mail.com</a>
                    </div>
                </div>
                <div className={` py-4 rounded-3xl flex items-center gap-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-10 lg:size-10 lg:border lg:p-2  lg:rounded-xl">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                    </svg>


                    <div>
                        <h1 className={`text-base md:text-lg  font-bold tracking-tighter`}>Visit Us</h1>
                        <h3 className={`text-sm md:text-base`}>Come say hello at our office HQ</h3>
                        <address>
                            <span className={`text-sm md:text-base`}>1299 McCarter Highway ( Route-21)</span>
                            <span className={`text-sm md:text-base`}>Newark, NJ 07104</span>
                        </address>
                    </div>
                </div>
                <div className={`py-4 rounded-3xl flex items-center gap-4`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-8 lg:size-10 lg:border lg:p-2  lg:rounded-xl">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>


                    <div>
                        <h1 className={`text-base md:text-lg  font-bold tracking-tighter`}>Call Us</h1>
                        <h3 className={`text-sm md:text-base`}>Mon-Fri from 10am to 6pm.</h3>
                        <a className={`text-sm md:text-base`} href={"mobile:+19733936850"}>+1 (973) 393-6850</a>
                    </div>
                </div>

            </div>
            <div className={`contact w-full rounded-3xl shadow-md bg-[#001A6E] text-white p-8`}>
                <form  onSubmit={sendMessage} className={`w-full flex flex-col`}>
                    <h1 className={`text-lg md:text-xl lg:text-3xl font-semibold tracking-tighter`}>Got a Question?</h1>
                    <h2 className={`mt-1 text-sm lg:text-base`}>Tell us more about yourself and what you got in mind</h2>
                    <div className={`mt-4 w-full flex justify-between items-center gap-4`}>
                        <Input
                            value={fName}
                            onChange={(e) => setfName(e.target.value)}
                            className={`text-sm lg:text-base placeholder:text-sm  rounded-xl border-[0.5px] bg-white text-[#001A6E] py-4`} placeholder="First Name"/>
                        <Input
                            value={lName}
                            onChange={(e) => setlName(e.target.value)}
                            className={` text-sm lg:text-base placeholder:text-sm  rounded-xl border-[0.5px] bg-white text-[#001A6E] py-4`} placeholder="Last Name"
                               />
                    </div>
                    <Input
                        value={mobile}
                        onChange={(e) => setmobile(e.target.value)}
                        className={`text-sm lg:text-base mt-4 placeholder:text-sm  rounded-xl border-[0.5px]  bg-white text-[#001A6E] py-4`} type={"telephone"} placeholder="Mobile"
                         />
                    <Input
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        className={`text-sm lg:text-base mt-4 placeholder:text-sm  rounded-xl border-[0.5px]  bg-white text-[#001A6E] py-4`} type={"email"}
                           placeholder="Email"/>
                    <textarea value={message}
                              onChange={(e) => setMessage(e.target.value)} className={`mt-4 min-h-[100px] text-sm lg:text-base placeholder:text-sm  rounded-xl resize-none text-[#001a6e] py-4 px-4 focus:outline-none`}   placeholder="Describe your query" />


                    <button type="submit" className={`w-max mt-8 px-6 py-2 lg:py-4 rounded-xl bg-white text-[#001A6E] font-semibold text-sm lg:text-base`}>
                        Submit
                    </button>
                </form>
            </div>

        </div>
    </div>
}

export default ContactLocationsPage;