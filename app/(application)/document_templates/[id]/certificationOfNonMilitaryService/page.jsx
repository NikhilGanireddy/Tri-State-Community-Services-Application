'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'
import {useToast} from "@/hooks/use-toast"

const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 2]
    const {toast} = useToast()

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
            placeOfBirth: '',
            fault: ""
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

    // For the "complaint for divorce" textboxes
    const [textBoxes, setTextBoxes] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [saving, setSaving] = useState(false)

    const addTextBox = () => {
        setTextBoxes([...textBoxes, {id: Date.now(), title: '', details: ''}])
    }

    const handleChange = (id, field, value) => {
        setTextBoxes(prev => prev.map(box => (box.id === id ? {...box, [field]: value} : box)))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    civilActionComplaintForDivorce: textBoxes, documentName: 'civilActionComplaintForDivorce', id
                })
            })

            if (response.ok) {
                const result = await response.json()
                setClientData(prev => ({
                    ...prev, documentTemplatesExtraDetails: {
                        ...prev.documentTemplatesExtraDetails,
                        civilActionComplaintForDivorce: result.data.documentTemplatesExtraDetails.civilActionComplaintForDivorce
                    }
                }))
                setSubmitted(true)
            } else {
                toast({
                    title: 'Error', description: "Error saving data."
                })
            }
        } catch (error) {
            console.error('Error:', error)
            toast({
                title: 'Error', description: "Error saving data."
            })
        } finally {
            setSaving(false)
        }
    }

    // Judgment demands
    const judgmentOptions = ["The plaintiff demands child support payments.", "The plaintiff requests sole custody of children.", "The plaintiff seeks an equitable distribution of marital assets.", "The plaintiff asks for spousal support for a period of 5 years.", "The plaintiff requests reimbursement for legal fees.", "Dissolving the marraiage between the parties", "Awarding Physical and Legal custody of the children to the Plaintiff and Defendant as per the attached agreement", "Ordering that defendant pay child support to plaintiff", "Ordering Plaintiff and Defendant to continue to mutually determine the amount of time that the children will spend with each parent as per the attached agreement.", "Ordering the Defendant to continue to pay child support to the Plaintiff as per the attached agreement.", "Incorporating the attached Property Settlement Agreement into Final Judgement of Divorce.", "Granting such relief as the count may deem equitable and just."]

    // Default & custom demands
    const [selectedJudgmentDemands, setSelectedJudgmentDemands] = useState([])
    const [customJudgmentDemands, setCustomJudgmentDemands] = useState([])
    const [judgmentDemandsSaved, setJudgmentDemandsSaved] = useState(false)

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
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Civil Action Complaint For Divorce`;
                }
                // Build up "selected" vs. "custom" from DB
                if (data.documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands) {
                    setSelectedJudgmentDemands(data.documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands
                        .filter(d => judgmentOptions.includes(d.demand))
                        .map(d => d.demand))
                    setCustomJudgmentDemands(data.documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands
                        .filter(d => !judgmentOptions.includes(d.demand))
                        .map(d => ({id: Date.now() + Math.random(), demand: d.demand})))
                }
                setSubmitted(data.documentTemplatesExtraDetails.civilActionComplaintForDivorce.length !== 0)
            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchClientData()
    }, [id])

    const toggleJudgmentDemand = (sentence) => {
        setSelectedJudgmentDemands(prev => prev.includes(sentence) ? prev.filter(item => item !== sentence) : [...prev, sentence])
    }

    const addCustomJudgmentDemand = () => {
        setCustomJudgmentDemands([...customJudgmentDemands, {id: Date.now(), demand: ''}])
    }

    const updateCustomJudgmentDemand = (id, value) => {
        setCustomJudgmentDemands(prev => prev.map(demand => (demand.id === id ? {...demand, demand: value} : demand)))
    }

    const handleSaveJudgmentDemands = async () => {
        try {
            // Only saving demands to the DB;
            // no file or folder creation is happening here.
            const response = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    civilActionComplaintForDivorceJudgementDemands: [...selectedJudgmentDemands.map(demand => ({demand})), ...customJudgmentDemands.map(d => ({demand: d.demand}))],
                    documentName: 'civilActionComplaintForDivorceJudgementDemands',
                    id
                })
            })

            if (!response.ok) {
                toast({
                    title: 'Error', description: "Error saving judgment demands.", variant: "sucess"
                })
                return
            }
            toast({
                title: 'Success', description: "Judgment Demands saved successfully!"
            })
            setJudgmentDemandsSaved(true)

        } catch (error) {
            console.error('Error:', error)
            toast({
                title: 'Error', description: "Error saving judgment demands."
            })
        }
    }


    return (<div className='p-4 text-sm flex flex-col min-w-screen min-h-screen w-full h-screen font-sans'>
        {/* Top Section */}


        <div className='w-full flex flex-col justify-between'>
            <div className=' capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col gap-0 justify-between`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                    <h2>{clientData.plaintiff.mobile}</h2>
                    <div className='bg-black text-black w-full h-[1.5px] mt-12'/>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
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
                    <h2 className={`uppercase`}>COUNTY: {clientData.courtDecision.current.county}</h2>
                    <h2>DOCKET NUMBER: _______________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-6'/>
        <div className='w-full flex justify-between items-end'>
            <div className=' capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>Certification of Non-Military Service</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8'>
            <h1 className={`my-8`}>I, ____________________________________, hereby certify that:</h1>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    I am the (check one) ☐ Plaintiff ☐ Defendant in the above-entitled civil action.

                </li>
                <li>
                    I am personally acquainted with the other party and know that he or she resides at:

                </li>
                ____________________________________________________________________________________
                ____________________________________________________________________________________
                <li>
                    The other party is not in the Military Service of the United States.
                </li>
                <li>
                    I am supplying the Court with the following information as to how I know the other party is not in
                    the military. (Check all statements below that apply to your case. In each case, you must explain
                    how any contact proves that the other party is not in the military.)
                    <ul className={`list-none`}>
                        <li>
                            ☐ I have recently seen the other party (when, where, circumstances):
                            _______________________________________________________________
                        </li>
                        <li>
                            ☐ My child(ren) last had parenting time with him or her on (when, where, circumstances):
                            _________________________________________ at ________________________________________

                        </li>
                        <li>
                            ☐ I have recently had telephone contact with the other party.
                            _______________________________________________________________
                        </li>
                        <li>
                            ☐ I know where the other party works (indicate employer name and address):
                            _______________________________________________________________

                        </li>
                        <li>
                            ☐ To my knowledge, the other party’s age exceeds the military requirements (state age):
                            _______________.

                        </li>
                        <li>
                            ☐ The other party is disabled (indicate nature of disability):
                            _______________________________________________________________.

                        </li>
                        <li>
                            ☐ The other party is incarcerated (indicate location):
                            _______________________________________________________________.

                        </li>
                        <li>
                            ☐ Any other reason:
                            _______________________________________________________________.


                        </li>
                        <li className={`font-bold`}>
                            and/or


                        </li>
                        <li>
                            ☐ I have checked with the Department of Defense website and the printout is attached.
                            (https://scra.dmdc.osd.mil/) <span className={`font-bold`}>OR</span>
                        </li>
                        <li>
                            ☐ I have attached statements from the 5 armed forces that the other party is not in the
                            military service.

                        </li>
                    </ul>
                </li>

            </ol>

            <div className='mt-8 pt-'>
                <h1 className={`mb-8`}>I certify that the foregoing statements made by me are true. I am aware that if any of the foregoing
                    statements made by me are willfully false, I am subject to punishment.</h1>
                <div className={`flex flex-row gap-2 w-full justify-between items-baseline `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2> Dated: _______________________</h2>
                    </div>
                    <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                        <div className={`w-64 h-[1.5px] bg-black`}/>
                        <h2>Plaintiff / Defendant</h2>
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