'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'

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
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Final Judgement Of Divorce`;
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
                    <h2 className={`flex gap-2`}>Petitioner's Name: <div
                        className='bg-black text-black w-36 h-[1px] my-3'/></h2>
                    <h2 className={`flex gap-2`}>Address: <div className='bg-black text-black w-48 h-[1px] my-3'/>
                    </h2>

                    <div className='bg-black text-black w-64 h-[1px] my-3'/>
                    <h2 className={`flex gap-2`}>Phone Number: <div className='bg-black text-black w-40 h-[1px] my-3'/>
                    </h2>


                    <div className='font-medium capitalize flex flex-col justify-between mt-6'>
                        <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                        <div className='bg-black text-black h-[1px] w-[350px] '/>

                        <h2>Plaintiff</h2>
                    </div>
                </div>
                <div className={`w-full`}>

                </div>
            </div>
            <div className={`flex flex-row w-full justify-between items-center`}>
                <div></div>
                <div className='font-medium capitalize'>
                    <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                    <h2>CHANCERY DIVISION-FAMILY PART</h2>
                    <h2>COUNTY</h2>
                    <h2>DOCKET NUMBER NONE</h2>
                    {clientData.defendant.fault}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                <div className='bg-black text-black w-full h-[1px] '/>
                <h2>Defendant</h2>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl font-bold text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>FINAL JUDGEMENT OF DIVORCE</h1>
                <h1 className='text-lg text-center font-bold'>Pro/se</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-2 '>
            <div className={`flex flex-col gap-4`}>
                <p className={``}>This matter been heard on _______________ before Honorable _______________,
                    J.S.C., in the presence of the Plaintiff: upon complaint in open court, and the court having heard
                    and considered the complaint and proofs, and it appearing that the Plaintiff and Defendant were
                    married to each other on _______________, and the plaintiff having pleaded and proved a cause of
                    action for divorce under the Statute in such case made and provided; and the plaintiff having been a
                    bona fide resident of this state for more than one year preceding the commencement of this action,
                    and jurisdiction having acquired over the Defendant pursuant to rules governing the courts.</p>


                <p className={``}>It is on this ______ day of _____________, 201, <span
                    className={`font-bold uppercase`}>ORDERED AND ADJUDGED</span> and such court,
                    by virtue of the power and authority of this court and the acts of legislature in such case
                    provided.</p>

                <p className={`indent-12`}>
                    Does <span className={`font-bold uppercase`}>ORDER AND ADJUDGE</span> that the Plaintiff and the
                    Defendant be divorced from the bond of matrimony for the cause(s) aforesaid, and the marriage
                    between the parties hereby dissolved:

                    <span className={`font-bold uppercase`}>ORDERED</span>, as follows:
                </p>

                <p className={"font-bold indent-12"}>The marriage is dissolved.</p>

            </div>
            {/* Judgment Demands */}
            <div className='mt'>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-between items-center `}>

                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2 className={`flex justify-between items-end`}> Date: <span
                            className={`min-w-64 w-full h-[1px]  -mt-1 bg-black`}/></h2>
                    </div>
                    <div className={`flex flex-col gap-1 justify-end mt-8`}>
                        <h2 className={``}></h2>
                        <div className={`min-w-64 w-full h-[1px]  -mt-1 bg-black`}/>
                        <span className={`font-bold`}> J.S.C.</span>
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