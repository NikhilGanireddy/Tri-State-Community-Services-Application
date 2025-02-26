'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'
import {format} from "date-fns";

const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 2]

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
            county:"",
            dob: null,
            mobile: '',
            placeOfBirth: ''
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
            placeOfBirth: ''
        }, marriage: {
            dateOfMarriage: null, cityOfMarriage: '', stateOfMarriage: '', dateOfSeparation: null
        }, children: {
            count: 1, details: [{
                id: '0', name: '', dob: null, placeOfBirth: '', ssn: '', sex: ''
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
            driversLicense: {number: '', stateOfIssue: ''},
            employerDetails: {name: '', contact: '', address: ''},
            professionalLicense: {details: ''}
        }, biographicDetails: {
            gender: '', race: '', height: '', weight: '', eyeColor: '', hairColor: ''
        }, referralSource: {media: '', nameOfMedia: ''}, sheriffAddress: {
            addressLine1: '', addressLine2: '', city: '', state: '', zip: '', notes: ''
        }, serviceFee: '', documentTemplatesExtraDetails: {
            civilActionComplaintForDivorce: [{title: "", details: ""}],
            civilActionComplaintForDivorceJudgementDemands: [{demand: ""}],
            acknowledgementOfServices: [{title: "", details: ""}],
            martialSettlementAgreement: [{title: "", details: ""}],

        }
    })

    // For delaying window.print
    const [isPrinting, setIsPrinting] = useState(false)
    const handlePrint = () => {
        setIsPrinting(true)
        // Wait 2 seconds before calling window.print()
        setTimeout(() => {
            window.print()
            // Re-enable the button after printing completes
            window.onafterprint = () => setIsPrinting(false)
        }, 2000)
    }

    // Default & custom demands

    useEffect(() => {
        if (!id) return

        const fetchClientData = async () => {
            try {
                const response = await fetch(`/api/getClientById/${id}`)
                if (!response.ok) {
                    new Error('Failed to fetch client data')
                }
                const data = await response.json()
                setClientData(data)

                if (data?.plaintiff?.firstName && data?.defendant?.firstName) {
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Request for Non-Appearance Judgement For Divorce`;
                }

            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchClientData()
    }, [id])


    return (<div className='p-4 text-sm flex flex-col min-w-screen min-h-screen font-sans w-full h-screen'>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                    <h2>{clientData.plaintiff.mobile}</h2>
                    <div className='bg-black text-black w-full h-[1.5px] my-3'/>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
                    <h2>Plaintiff</h2>
                </div>
                <div className={`w-full`}>

                </div>
            </div>
            <div className={`flex flex-row w-full justify-between items-center`}>
                <div></div>
                <div className='font-medium capitalize'>
                    <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                    <h2>CHANCERY DIVISION-FAMILY PART</h2>
                    <h2 className={`uppercase`}>COUNTY: {clientData.plaintiff.county}</h2>
                    <h2>DOCKET NUMBER: _____________</h2>
                    {clientData.defendant.fault}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>REQUEST FOR NON-APPEARANCE</h1>
                <h1 className='text-xl text-center font-bold'>JUDGEMENT FOR DIVORCE</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-2 '>
            <div>
                <p className={`indent-12`}>I {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}, Plaintiff,
                    reside
                    at {clientData.plaintiff.address1}, {clientData.plaintiff.address2}, {clientData.plaintiff.city} and
                    the State of {clientData.plaintiff.state}, request a Non-Appearance Judgement for Divorce (Judgement
                    based on papers).</p>
            </div>
            {/* Judgment Demands */}
            <div className='mt'>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-between items-start `}>
                    <div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2 className={`flex justify-between items-end`}> Date: <span className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/></h2>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-1 justify-start`}>
                        <h2 className={``}></h2>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`text-`}> (Plaintiff's signature) Plaintiff Pro Se</span>
                        <h2 className={` mt-4`}> {`${clientData.plaintiff.lastName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.firstName}`}</h2>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`text-`}> Plaintff's Name printed</span>
                    </div>
                </div>


                {/* Print Button (delayed by 2s, disabled while waiting) */}
                {isPrinting ? (" ") : (<div className="mt-6">
                    <Button variant="outline" onClick={handlePrint}>
                        Print Document
                    </Button>
                </div>)}
            </div>
        </div>
    </div>)
}

export default Page