'use client'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import useMousePosition from "@/utils/cursor";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import * as React from "react";
import {format, getDate, getMonth, getYear} from 'date-fns'


const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 1]
    const {x, y} = useMousePosition();


    const [clientData, setClientData] = useState({
        plaintiff: {
            firstName: '',
            middleName: '',
            lastName: '',
            maidenName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            dob: null,
            mobile: '',
            placeOfBirth: '',
            inNewJersey: null
        }, defendant: {
            firstName: '',
            middleName: '',
            lastName: '',
            maidenName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            dob: null,
            mobile: '',
            placeOfBirth: '',
            fault: '',
        }, marriage: {
            dateOfMarriage: null, cityOfMarriage: '', stateOfMarriage: '', dateOfSeparation: null
        }, children: {
            count: 1, details: [{
                id: '0', name: '', dob: null, placeOfBirth: '', ssn: '',
            }]
        }, custody: {
            physicalCustody: '',
            legalCustody: '',
            visitationLimitation: '',
            childSupport: '',
            supportAmount: '',
            supportFrequency: ''
        }, courtDecision: {
            previous: {
                docketNumber: '', caseName: '', county: ''
            }, current: {
                docketNumber: '', caseName: '', county: ''
            }
        }, realEstateDetails: {
            properties: [{description: '', equity: ''}, {description: '', equity: ''}, {description: '', equity: ''}],
            personalProperty: {
                defendant: '', plaintiff: ''
            }
        }, insurance: {
            hasInsurance: false, details: {
                life: {company: '', policy: ''}, auto: {company: '', policy: ''}, health: {
                    company: '', policy: '', group: '', throughEmployment: false
                }, homeowners: {company: '', policy: ''}
            }
        }, licenses: {
            driversLicense: {
                number: '', stateOfIssue: ''
            }, employerDetails: {
                name: '', contact: '', address: ''
            }, professionalLicense: {
                details: ''
            }
        }, biographicDetails: {
            gender: '', race: '', height: '', weight: '', eyeColor: '', hairColor: ''
        }, referralSource: {
            media: '', nameOfMedia: ''
        }, sheriffAddress: {
            addressLine1: '', addressLine2: '', city: '', state: '', zip: '', notes: ''
        }, serviceFee: '' // New field for service fee
    })


    useEffect(() => {
        if (!id) return; // Wait for the ID to be available

        const fetchClientData = async () => {
            try {
                const response = await fetch(`/api/getClientById/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch client data');
                }
                const data = await response.json();
                setClientData(data); // Populate state with fetched data
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchClientData();
    }, [id]);


    return (<div
        className="cursor-none relative overflow-x-hidden overflow-y-auto bg-fixed bg-cover bg-center h-full flex flex-col items-center justify-center bg-[url('/Wall2.jpg')] bg-white/20 min-h-screen">

        {/* Custom Cursor Large Circle */}
        <motion.div
            initial={{opacity: 0}}
            animate={{
                x: x - 32, // Offset to center
                y: y - 32, opacity: 1,
            }}
            transition={{type: "tween", ease: "backOut", duration: 0.3}}
            className="hidden md:inline-flex md:fixed md:w-16 md:h-16 md:border-[1px] md:border-black md:bg-transparent md:rounded-full md:z-50 pointer-events-none"
            style={{left: 0, top: 0, transform: "translate(-50%, -50%)"}}
        />

        {/* Custom Cursor Small Dot */}
        <motion.div
            initial={{opacity: 0}}
            animate={{
                x: x - 1, // Small offset for precision
                y: y - 1, opacity: 1,
            }}
            transition={{type: "tween", ease: "backOut", duration: 0.1}}
            className="hidden md:inline-flex md:fixed md:w-2 md:h-2 md:bg-black md:rounded-full md:z-50 pointer-events-none"
            style={{left: 0, top: 0, transform: "translate(-50%, -50%)"}}
        />
        <div
            className="w-[90%] max-w-[1600px] flex flex-col  items-center p-8 rounded-3xl min-h-[90vh] shadow-2xl bg-white/10 h-full backdrop-blur-md">
            <div className={`flex justify-between items-center w-full h-full`}>
                <Link href={'/'} className={`text-xl md:text-4xl font-semibold w-max`}>
                    Tri State Community Services
                </Link>
                <Link href={'/dashboard'} className={`text-sm md:text-base font-semibold w-max`}>
                    <Button>Dashboard</Button>
                </Link>
            </div>
            <div className={`mt-24 flex justify-center items-center w-full h-full`}>
                <div className={`w-full h-full`}>

                    <h1><span className={   `font-bold`}>Name</span> : {clientData.plaintiff.firstName}
                    </h1>
                    <h2><span className={   `font-bold`}> Date Of Birth:</span> {format(Date.now(), 'PPP')}</h2>
                    <h1><span className={   `font-bold`}>City</span> : {clientData.plaintiff.city}
                    </h1>
                    <h1><span className={   `font-bold`}>Mobile</span> : {clientData.plaintiff.mobile}
                    </h1>

                    <h6 className={`mt-12 opacity-55`}>Please select the documents you want to print.</h6>
                </div>
                <div className={`w-full h-full flex flex-col gap-4`}>
                    <Button className=''>
                        <Link href={`/document_templates/${id}/civilActionComplaintForDivorce`}>
                            {' '}
                            Civil Action Complaint For Divorce
                        </Link>

                    </Button>
                    <Button className=''>
                        <Link href={`/document_templates/${id}/acknowledgementOfServices`}>
                            {' '}
                            Acknowledgement Of Services
                        </Link>

                    </Button>
                </div>
            </div>

            <title>Documents</title>

        </div>
    </div>)
}

export default Page
