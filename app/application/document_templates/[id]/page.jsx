'use client'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import useMousePosition from "@/utils/cursor";
import {motion} from "framer-motion";
import * as React from "react";
import {useEffect, useState} from "react";


const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 1]
    const {x, y} = useMousePosition();
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [Loading, setLoading] = useState(false);
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
            county:'',
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
            className="w-[90%] max-w-[1600px] flex flex-col overflow-y-scroll  items-center p-8 rounded-3xl max-h-[90vh] min-h-[90vh] shadow-2xl bg-white/10 h-full backdrop-blur-md">
            <div className={`flex justify-between items-center w-full h-full`}>
                <Link href={'/application/dashboard'} className={`text-xl md:text-4xl font-semibold w-max`}>
                    Tri State Community Services
                </Link>
                <Link href={'/application/dashboard'} className={`text-sm md:text-base font-semibold w-max`}>
                    <Button>Dashboard</Button>
                </Link>
            </div>
            <div className={`mt-24 md:flex-row flex-col flex justify-center items-center w-full h-full`}>
                <div className={`w-full h-full`}>

                    <h1><span className={`font-bold`}>Plaintiff</span> : {clientData.plaintiff.firstName}
                    </h1>
                    <h2><span className={`font-bold`}> Defendant:</span> {clientData.defendant.firstName}</h2>
                    <h1><span className={`font-bold`}>City</span> : {clientData.plaintiff.city}
                    </h1>
                    <h1><span className={`font-bold`}>Mobile</span> : {clientData.plaintiff.mobile}
                    </h1>

                    <h6 className={`mt-12 text-sm opacity-55`}>Please select the documents you want to print.</h6>
                </div>
                <div
                    className={`w-full max-h-[60vh] min-h-[60vh] h-full overflow-y-auto text-sm gap-4 flex-col flex text-start`}>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/civilActionComplaintForDivorce`}>
                        {' '}
                        Complaint For Divorce
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all ease-in-out duration-500 group-hover:inline">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>

                    </Link>

                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/acknowledgementOfServices`}>
                        {' '}
                        Acknowledgement Of Services
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>

                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/requestForNonAppearanceJudgementForDivorce`}>
                        {' '}
                        Request for Non-Appearance Judgement For Divorce
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/martialSettlementAgreement`}>
                        {' '}
                        Martial Settlement Agreement
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>

                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/military`}>
                        {' '}
                        Military
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>

                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/requestForNameChangePlaintiff`}>
                        {' '}
                        Plaintiff - Request For Name Change
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/requestForNameChangeDefendant`}>
                        {' '}
                        Defendant - Request For Name Change
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>

                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/finalJudgementOfDivorce`}>
                        {' '}
                        Final Judgement Of Divorce
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/certificationOfVerificationAndNonCollusion`}>
                        {' '}
                        Certification Of Verification And Non-Collusion

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/rule5:4_2(h)CertificationBySelf_RepresentedLitigant`}>
                        {' '}
                        Rule 5:4-2(h) Certification by Self-Represented Litigant

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/certificationOfNonMilitaryService`}>
                        {' '}
                        Certification of Non-Military Service

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/plaintiffAffidavitOfNon_Military`}>
                        {' '}
                        Plaintiff Affidavit Of Non_Military


                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/defendantAffidavitOfNon_Military`}>
                        {' '}
                        Defendant's Affidavit of Non-Military

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/requestForCertification_EnterDefault`}>
                        Request And Certification To Enter Default


                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/certificationOfInternationalDomicile`}>
                      Certification Of International Domicile


                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>
                    <Link
                        className={'flex justify-between items-center group overflow-hidden px-6 py-3 bg-black rounded-lg text-white text-sm '}
                        href={`/application/document_templates/${id}/certificationOfInsurance`}>
                        Certification Of Insurance


                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="hidden size-4 transition-all duration-100 group-hover:flex">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                        </svg>
                    </Link>


                </div>
            </div>

            <title>Documents</title>

        </div>
    </div>)
}

export default Page
