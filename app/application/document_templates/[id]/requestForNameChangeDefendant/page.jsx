'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'
import {format} from 'date-fns'
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
            county:'',
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
                plaintiff: '', defendant: ''
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
    const judgmentOptions = ["The defendant demands child support payments.", "The defendant requests sole custody of children.", "The defendant seeks an equitable distribution of marital assets.", "The defendant asks for spousal support for a period of 5 years.", "The defendant requests reimbursement for legal fees.", "Dissolving the marraiage between the parties", "Awarding Physical and Legal custody of the children to the defendant and Defendant as per the attached agreement", "Ordering that defendant pay child support to defendant", "Ordering defendant and Defendant to continue to mutually determine the amount of time that the children will spend with each parent as per the attached agreement.", "Ordering the Defendant to continue to pay child support to the defendant as per the attached agreement.", "Incorporating the attached Property Settlement Agreement into Final Judgement of Divorce.", "Granting such relief as the count may deem equitable and just."]

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

                if (data?.defendant?.firstName && data?.defendant?.firstName) {
                    document.title = `${data.defendant.firstName} Vs ${data.defendant.firstName} | Request for Name change - Defendant                   `;
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
                    <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                    <h2>{clientData.defendant.address1}</h2>
                    <h2>{clientData.defendant.address2}</h2>
                    <h2>{clientData.defendant.city}, {clientData.defendant.state}, {clientData.defendant.zip}</h2>
                    <h2>{clientData.defendant.mobile}</h2>
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
                    <h2 className={`uppercase`}>COUNTY: {clientData.plaintiff.county} </h2>
                    <h2>DOCKET NUMBER: ___________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName} </h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] '/>
                
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>REQUEST FOR NAME CHANGE</h1>
                <h1 className={`text-center`}>{clientData.defendant.fault==="No Fault"? "No Fault":"Irreconcilable Differences"}</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-4 space-y-8'>
            <div className={`uppercase font-bold`}>
                <h1>STATE OF NEW JERSEY</h1>
                <h1>county of {clientData.defendant.county}</h1>
            </div>
            <p>
                I, {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                of full age, hereby certify:
            </p>
            <ol className='list-inside list-decimal flex flex-col space-y-4 mt-4'>
                <li>
                    I am the Defendant in the foregoing action for divorce.
                </li>
                <li>My current married name is: {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}.
                </li>

                <li className={``}>
                    My maiden name prior to this marriage was: {clientData.defendant.maidenName}
                </li>
                <li className={``}>
                    With the termination of this marriage, I would like to revert to my maiden name.
                </li>
                <li>
                    Request to incorporate my name change into the Final Judgment of Divorce.
                </li>


                {/*/!* Additional paragraphs from DB or newly added *!/*/}
                {/*{submitted ? (clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorce.map((item, index) => (*/}
                {/*    <li key={index}>*/}
                {/*        {item.title}: {item.details}*/}
                {/*    </li>))) : (<>*/}
                {/*    <Button onClick={addTextBox}>Add Textbox</Button>*/}
                {/*    {textBoxes.map(box => (<div key={box.id} className='border p-4 rounded-lg shadow my-2'>*/}
                {/*        <Label>Title</Label>*/}
                {/*        <Input*/}
                {/*            value={box.title}*/}
                {/*            onChange={e => handleChange(box.id, 'title', e.target.value)}*/}
                {/*        />*/}
                {/*        <Label>Details</Label>*/}
                {/*        <Textarea*/}
                {/*            value={box.details}*/}
                {/*            onChange={e => handleChange(box.id, 'details', e.target.value)}*/}
                {/*        />*/}
                {/*    </div>))}*/}
                {/*    <Button onClick={handleSave} disabled={saving}>*/}
                {/*        {saving ? 'Saving...' : 'Save'}*/}
                {/*    </Button>*/}
                {/*</>)}*/}

            </ol>



            <div className='mt-8 pt-4'>
                {/*<h2 className="font-bold mb-3">WHEREFORE THE defendant DEMANDS JUDGMENT:</h2>*/}
                {/*<ol className="list-decimal pl-5 mb-6">*/}
                {/*    {selectedJudgmentDemands.map((demand, index) => (<li key={`selected-${index}`} className="mt-1">*/}
                {/*        {demand}*/}
                {/*    </li>))}*/}
                {/*    {customJudgmentDemands.map((demand, index) => (<li key={`custom-${index}`} className="mt-1">*/}
                {/*        {demand.demand}*/}
                {/*    </li>))}*/}
                {/*</ol>*/}

                {/* Hide "Add or Remove Judgments" after saving */}
                {/*{!judgmentDemandsSaved && (<>*/}
                {/*    <h2 className="font-bold mb-2">Add or Remove Judgments</h2>*/}
                {/*    {judgmentOptions.map((option, index) => (<div key={index} className='flex items-center gap-2 mb-1'>*/}
                {/*        <Checkbox*/}
                {/*            checked={selectedJudgmentDemands.includes(option)}*/}
                {/*            onCheckedChange={() => toggleJudgmentDemand(option)}*/}
                {/*        />*/}
                {/*        <Label>{option}</Label>*/}
                {/*    </div>))}*/}

                {/*    <div className="mt-4">*/}
                {/*        <Button onClick={addCustomJudgmentDemand}>*/}
                {/*            Add Custom Demand*/}
                {/*        </Button>*/}
                {/*        {customJudgmentDemands.map((demand) => (*/}
                {/*            <div key={demand.id} className='mt-3 flex items-center gap-2'>*/}
                {/*                <Input*/}
                {/*                    value={demand.demand}*/}
                {/*                    placeholder='Enter custom demand...'*/}
                {/*                    onChange={(e) => updateCustomJudgmentDemand(demand.id, e.target.value)}*/}
                {/*                />*/}
                {/*            </div>))}*/}
                {/*    </div>*/}

                {/*    <div className="mt-4">*/}
                {/*        <Button onClick={handleSaveJudgmentDemands}>*/}
                {/*            Save Judgment Demands*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*</>)}*/}

                <div className={`font-bold flex flex-col gap-4 my-8 w-full justify-start `}>
                    <div className={`flex flex-col gap- justify-start mt-`}>
                        <div className={`w-64 h-[1.5px] bg-black -2`}/>
                        <h2><span className={`text-`}> Signature of the Defendant</span></h2>
                    </div>
                    <div>
                        <h1 className={`flex gap-2 justify-start items-end`}>State of <div
                            className={`w-24 h-[1.5px] bg-black`}/></h1>
                        <h1 className={`flex gap-2 justify-start items-end`}>County of <div
                            className={`w-24 h-[1.5px] bg-black`}/></h1>
                    </div>
                    <div className={`flex space-x-2 items-end justify-start`}>Signed before me on this <div
                        className={`w-8 h-[1.5px] bg-black`}/>of <div
                        className={`w-24 h-[1.5px] bg-black`}/> 20 <div className={`w-8 h-[1.5px] bg-black`}/></div>

                    <div className={`flex flex-col gap- justify-start mt-8`}>
                        <div className={`w-64 h-[1.5px] bg-black -2`}/>
                        <h2><span className={`text-`}> Signature and Seal of the Notary Public</span></h2>
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