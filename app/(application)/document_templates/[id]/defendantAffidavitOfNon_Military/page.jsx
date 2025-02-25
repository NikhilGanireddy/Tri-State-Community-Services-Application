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
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Request for Non-Appearance Judgement For Divorce`;
                }

            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchClientData()
    }, [id])


    return (<div className='p-4 text-base flex flex-col min-w-screen min-h-screen font-sans w-full h-screen'>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
                    <h2 className={`flex gap-2`}>Petitioner’s Name
                        : <div className='bg-black text-black w-36 h-[1px] my-3'/></h2>
                    <h2 className={`flex gap-2`}>Address: <div className='bg-black text-black w-[132px] h-[1px] my-3'/>
                    </h2>
                    <div className='bg-black text-black w-48 h-[1px] my-3'/>
                    <h2 className={`flex gap-2`}>Telephone: </h2>

                    <div className='font-medium capitalize flex flex-col justify-between mt-6'>
                        <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
                        <h2>Plaintiff</h2>
                        <div className='bg-black text-black h-[1px] w-[350px] my-3'/>
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
                    <h2>COUNTY {clientData.courtDecision.current.county}</h2>
                    <h2>DOCKET NUMBER {clientData.courtDecision.current.docketNumber}</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>REQUEST FOR NON-APPEARANCE</h1>
                <h1 className='text-xl text-center font-bold'>JUDGEMENT FOR DIVORCE</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-4 '>
            <div>
                <h1>STATE OF NEW JERSEY</h1>
                <h1>COUNTY OF _________</h1>
            </div>
            <p className={``}>I,
                defendant, {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                being of full age and duly sworn according to laws that support affidavits in the State of New Jersey
                depose and say:
            </p>
            <p>
                I am the defendant in this case and I am making this affidavit of non-military in support of my divorce.
            </p>
            <p>
                I, _______________, am not in the United States Military, but I am living a civilian life at the
                following address:
                ________________________________________

            </p>
        </div>
        <div className='mt-8 gap-8 w-full'>
            <div className={`flex flex-row gap-2 w-full justify-between items-baseline `}>
                <div className={`flex flex-col gap-2 justify-start`}>
                    <h2> Dated: _______________________</h2>
                </div>
                <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                    <h2>Defendant: _______________________</h2>
                </div>
            </div>
            <div className={`flex flex-col gap-2 jus mt-8 font-semibold`}>
                    <h1 className={`flex items-baseline`}>State
                        of {clientData.defendant.state}
                        {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                    </h1>

                <h1 className={`flex items-baseline`}>County of
                    of {clientData.courtDecision.current.county}
                    {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                </h1>
                <h1 className={`flex items-baseline`}>Signed before me on this
                    _____day of_____________20____
                </h1>
            </div>
            <div className={`flex flex-col mt-12 w-full justify-between items-start gap-1`}>
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
    </div>)
}

export default Page