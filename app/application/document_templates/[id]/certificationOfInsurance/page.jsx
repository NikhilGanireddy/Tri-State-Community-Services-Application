'use client'
import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {useToast} from "@/hooks/use-toast"
import {Button} from "@/components/ui/button";

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
            county: '',
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
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Certification of Insurance`;
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
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
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
                    <h2>DOCKET NUMBER: __________________</h2>
                    {/*{clientData.defendant.fault}*/}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-6'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>Certification of Insurance</h1>
                <h2 className='capitalize text-center'>{clientData.defendant?.fault === "No Fault" ? 'Based on 18 Months Separation' : "based on irreconcilable differences"}</h2>
                {/*<h2 className={`text-center`}>{clientData.defendant?.fault === "No Fault" ? '(No Fault)' : "Pro/Se"}</h2>*/}
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-4 space-y-8'>
            <div className={`uppercase font-bold`}>
                <h1>STATE OF {clientData.plaintiff.state}</h1>
                <h1>county of {clientData.plaintiff.county}</h1>
            </div>
            <p>
                I, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                of full age, hereby certify:
            </p>
            <ol className='list-inside list-decimal flex flex-col space-y-4 mt-4'>
                <li>
                    I am the Plaintiff in the foregoing action for divorce.
                </li>
                <li>The insurance policies listed in this certification represent all of the insurance coverage obtained
                    by me or for myself.
                </li>

                <li className={``}>
                    To the best of my knowledge and belief, none of the insurance coverage listed in this certification
                    was canceled or modified within the ninety days preceding the date of this certification.
                </li>
            </ol>


            <div className={`w-full flex items-center flex-col `}>
                <h1 className={`font-semibold underline underline-offset-2 mb-2 mt-4`}>LIFE INSURANCE</h1>

                <div className={` w-full flex items-center justify-between gap-4`}>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>Company:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}> {clientData.insurance.details.life.company}</div>
                    </div>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>ID:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{clientData.insurance.details.life.policy}</div>
                    </div>

                </div>
                <div className={` w-full flex items-center justify-between mt-2 gap-4`}>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>Insured’s&nbsp;name</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</div>
                    </div>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1 className={`w-max`}>Group&nbsp;No:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{"None"}</div>
                    </div>

                </div>


                <h1 className={`font-semibold underline underline-offset-2 mb-2 mt-4`}>HEALTH INSURANCE</h1>

                <div className={` w-full flex items-center justify-between gap-4`}>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>Company:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}> {clientData.insurance.details.health.company}</div>
                    </div>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>ID:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{clientData.insurance.details.health.policy}</div>
                    </div>

                </div>
                <div className={` w-full flex items-center justify-between mt-2 gap-4`}>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1>Insured’s&nbsp;name</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</div>
                    </div>
                    <div className={`flex items-baseline w-full gap-2`}>
                        <h1 className={`w-max`}>Group&nbsp;No:</h1>
                        <div
                            className={`w-full underline underline-offset-2`}>{clientData.insurance.details.health.group !=""?"":"None"}</div>

                    </div>

                </div>


                <p className={`text-start w-full mt-4`}>Check if made available through: ________________________ Employment ____________________ Personally Obtained</p>


            </div>
        </div>
        {isPrinting ? (" ") : (<div className="mt-6">
            <Button variant="outline" onClick={handlePrint}>
                Print Document
            </Button>
        </div>)}
    </div>)
}

export default Page