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
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Acknowledgement Of Services`;
                }

            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchClientData()
    }, [id])



    return (<div className='p-4 text-base flex flex-col min-w-screen min-h-screen font-sans w-full h-screen'>
        {/* Top Section */}
        <div className='w-full flex flex-row items-center justify-between font-xs'>
            <div className=' font-xs capitalize'>
                <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                <h2>{clientData.plaintiff.address1}</h2>
                <h2>{clientData.plaintiff.address2}</h2>
                <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                <h2>{clientData.plaintiff.mobile}</h2>
            </div>
            <div className=' font-xs capitalize'>
                <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                <h2>CHANCERY DIVISION-FAMILY PART</h2>
                <h2>COUNTY</h2>
                <h2>DOCKET NUMBER NONE</h2>
            </div>
        </div>
        <div className='bg-black text-black w-full h-[1px] my-3'/>
        <div className='w-full flex justify-between items-center'>
            <div className=' font-xs text-base capitalize flex flex-col justify-start items-start space-y-4'>
                <div>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                    <h2>Plaintiff</h2>
                </div>
                <h2 className={`text-center w-full`}>Vs</h2>
                <div>
                    <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                    <h2>Defendant</h2>
                </div>
            </div>
            <div className=''>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>ACKNOWLEDGEMENT OF SERVICE</h1>
                <h1 className='text-xl text-center font-bold'>OF SUMMONS AND COMPLAINT BY</h1>
                <h1 className='text-xl text-center font-bold'>THE DEFENDANT AND WAIVER</h1>

                <h2 className='capitalize'>Based on 18 Months Separation (No Fault)</h2>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-8 '>
            <div>
                <p className={`indent-12`}>The undersigned hereby acknowledges service of a copy of the summons and
                    complaint.</p>
                <p>I, the defendant, waive my 35 days to answer the complaint.</p></div>
            {/* Judgment Demands */}
            <div className='mt-8'>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-between items-start `}>
                    <div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2> Dated: <span className={`underline`}>{format(Date.now(), 'PPP')}</span></h2>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-1 justify-start`}>
                        <h2 className={``}> {`${clientData.plaintiff.lastName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.firstName}`}</h2>
                        <div className={`min-w-64 w-full h-[2px]  -mt-1 bg-black`}/>
                        <span className={`text-sm`}> Defendant</span>
                    </div>
                </div>

                <div className={`flex flex-col mt-12 w-full justify-between items-start `}>
                    <h2> State of New Jersey &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>
                    <h2> County of  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>

                </div>

                <div className={`flex flex-col gap-2 mt-12 w-full items-start`}>
                    <h2> Signed before me on this</h2>
                    <div className={`flex items-end`}>
                        <div className={` w-12 h-[2px] bg-black`}/>
                        <span>day of </span>
                        <div className={` w-40 h-[2px] bg-black`}/>
                        <span>20</span>
                        <div className={` w-20 h-[2px] bg-black`}/>
                    </div>
                </div>

                <div className={`flex flex-col mt-32 w-full justify-between items-start gap-1`}>
                    <div className={` w-80 h-[2px] bg-black`}/>

                    <h2> Signature of the Notary Public</h2>

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