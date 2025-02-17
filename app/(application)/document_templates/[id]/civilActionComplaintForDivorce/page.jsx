'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {usePathname} from 'next/navigation'
import {getDate, getMonth, getYear} from 'date-fns'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Checkbox} from "@/components/ui/checkbox"
import {useToast} from "@/hooks/use-toast"
import {format} from 'date-fns'
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
            civilActionComplaintForDivorceJudgementDemands: [{demand: ""}]
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
    const judgmentOptions = ["The plaintiff demands child support payments.", "The plaintiff requests sole custody of children.", "The plaintiff seeks an equitable distribution of marital assets.", "The plaintiff asks for spousal support for a period of 5 years.", "The plaintiff requests reimbursement for legal fees."]

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
                    title: 'Error', description: "Error saving judgment demands."
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

    return (<div className='p-4 flex flex-col min-w-screen min-h-screen w-full h-screen font-sans'>
        {/* Top Section */}
        <div className='w-full flex flex-row items-center justify-between'>
            <div className='font-medium capitalize'>
                <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                <h2>{clientData.plaintiff.address1}</h2>
                <h2>{clientData.plaintiff.address2}</h2>
                <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                <h2>+1{clientData.plaintiff.mobile}</h2>
            </div>
            <div className='font-medium capitalize'>
                <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                <h2>CHANCERY DIVISION-FAMILY PART</h2>
                <h2>COUNTY</h2>
                <h2>DOCKET NUMBER NONE</h2>
            </div>
        </div>
        <div className='bg-black text-black w-full h-[1px] my-3'/>
        <div className='w-full flex justify-between items-center'>
            <div className='font-medium capitalize flex justify-between items-center space-x-4'>
                <div>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                    <h2>Plaintiff</h2>
                </div>
                <h2>Vs</h2>
                <div>
                    <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                    <h2>Defendant</h2>
                </div>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>COMPLAINT FOR DIVORCE</h1>
                <h2 className='capitalize'>based on irreconcilable differences</h2>
                <h2>Pro/Se</h2>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8'>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    The Plaintiff, {clientData.plaintiff.firstName} {clientData.plaintiff.lastName}, resides
                    at {clientData.plaintiff.address1},
                    in the City of {clientData.plaintiff.city} and the State of {clientData.plaintiff.state}.
                </li>
                <li>
                    Plaintiff was lawfully married
                    to {clientData.defendant.firstName} {clientData.defendant.lastName} on{' '}
                    {clientData.marriage.dateOfMarriage} in {clientData.marriage.cityOfMarriage},{' '}
                    {clientData.marriage.stateOfMarriage}.
                </li>
                <li>
                    There are {clientData.children.count > 0 ? clientData.children.count : 'no'} children born
                    of marriage.
                </li>

                {/* Children Table */}
                {clientData.children.count > 0 && (<Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Place of Birth</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead className='text-right'>Sex</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientData.children.details.map(user => (<TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.placeOfBirth}</TableCell>
                            <TableCell>
                                {user.dob ? `${getMonth(user.dob) + 1}-${getDate(user.dob)}-${getYear(user.dob)}` : ''}
                            </TableCell>
                            <TableCell className='text-right'>{user.sex}</TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>)}

                {/* Additional paragraphs from DB or newly added */}
                {submitted ? (clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorce.map((item, index) => (
                    <li key={index}>
                        {item.title}: {item.details}
                    </li>))) : (<>
                    <Button onClick={addTextBox}>Add Textbox</Button>
                    {textBoxes.map(box => (<div key={box.id} className='border p-4 rounded-lg shadow my-2'>
                        <Label>Title</Label>
                        <Input
                            value={box.title}
                            onChange={e => handleChange(box.id, 'title', e.target.value)}
                        />
                        <Label>Details</Label>
                        <Textarea
                            value={box.details}
                            onChange={e => handleChange(box.id, 'details', e.target.value)}
                        />
                    </div>))}
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </>)}

                <li>
                    The plaintiff and the defendant in the matter have been parties to the following prior action:
                    <div className='ml-4 mt-4'>
                        Caption of the case: {clientData.courtDecision.previous.caseName}
                    </div>
                    <div className='ml-4'>
                        Docket No.: {clientData.courtDecision.previous.docketNumber}
                    </div>
                </li>
            </ol>

            {/* Judgment Demands */}
            <div className='mt-8 border-t pt-4'>
                <h2 className="font-bold mb-3">WHEREFORE THE PLAINTIFF DEMANDS JUDGMENT:</h2>
                <ol className="list-decimal pl-5 mb-6">
                    {selectedJudgmentDemands.map((demand, index) => (<li key={`selected-${index}`} className="mt-1">
                        {demand}
                    </li>))}
                    {customJudgmentDemands.map((demand, index) => (<li key={`custom-${index}`} className="mt-1">
                        {demand.demand}
                    </li>))}
                </ol>

                {/* Hide "Add or Remove Judgments" after saving */}
                {!judgmentDemandsSaved && (<>
                    <h2 className="font-bold mb-2">Add or Remove Judgments</h2>
                    {judgmentOptions.map((option, index) => (<div key={index} className='flex items-center gap-2 mb-1'>
                        <Checkbox
                            checked={selectedJudgmentDemands.includes(option)}
                            onCheckedChange={() => toggleJudgmentDemand(option)}
                        />
                        <Label>{option}</Label>
                    </div>))}

                    <div className="mt-4">
                        <Button onClick={addCustomJudgmentDemand}>
                            Add Custom Demand
                        </Button>
                        {customJudgmentDemands.map((demand) => (
                            <div key={demand.id} className='mt-3 flex items-center gap-2'>
                                <Input
                                    value={demand.demand}
                                    placeholder='Enter custom demand...'
                                    onChange={(e) => updateCustomJudgmentDemand(demand.id, e.target.value)}
                                />
                            </div>))}
                    </div>

                    <div className="mt-4">
                        <Button onClick={handleSaveJudgmentDemands}>
                            Save Judgment Demands
                        </Button>
                    </div>
                </>)}

                <div className={`flex flex-row gap-2 mt-32 w-full justify-end `}>
                    <div>

                    </div>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <div className={`w-64 h-[2px] bg-black`}/>
                        <h2>(Signature of the Plaintiff) <span className={`text-sm`}> Plaintiff</span></h2>
                    </div>
                </div>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-end `}>
                    <div>

                    </div>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2 className={``}> {`${clientData.plaintiff.lastName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.firstName}`}</h2>
                        <div className={`min-w-64 w-full h-[2px]  -mt-2 bg-black`}/>
                        <h2 className={``}>(Plaintiff's Name, Printed) <span className={`text-sm`}> Plaintiff</span></h2>
                    </div>
                </div>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-start `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2> Dated: <span className={`underline`}>{ format(Date.now(), 'PPP')}</span></h2>
                    </div>
                    <div>

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