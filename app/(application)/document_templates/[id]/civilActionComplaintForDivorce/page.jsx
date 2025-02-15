'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {usePathname} from 'next/navigation'
import {getDate, getMonth, getYear} from 'date-fns'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";

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
        }, serviceFee: '', documentTemplatesExtraDetails: {
            civilActionComplaintForDivorce: [{title: "", details: ""}],
            civilActionComplaintForDivorceJudgementDemands: [{demand:""}]
        }
    })

    const [textBoxes, setTextBoxes] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedSentences, setSelectedSentences] = useState([])
    const [customSentences, setCustomSentences] = useState([])


    useEffect(() => {
        if (!id) return

        const fetchClientData = async () => {
            try {
                const response = await fetch(`/api/getClientById/${id}`)
                if (!response.ok) throw new Error('Failed to fetch client data')

                const data = await response.json()
                setClientData(data)
                setSubmitted(data.documentTemplatesExtraDetails.civilActionComplaintForDivorce.length !== 0)
            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchClientData()
    }, [id])

    const addTextBox = () => {
        setTextBoxes([...textBoxes, { id: Date.now(), title: '', details: '' }])
    }

    const handleChange = (id, field, value) => {
        setTextBoxes(prev => prev.map(box => (box.id === id ? { ...box, [field]: value } : box)))
    }

    const [showSavedJudgments, setShowSavedJudgments] = useState(false);

    const handleSubmit = () => setSubmitted(true)


    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/saveDocumentTemplates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    civilActionComplaintForDivorce: textBoxes,
                    documentName: 'civilActionComplaintForDivorce',
                    id
                })
            })

            if (response.ok) {
                const result = await response.json()
                setClientData(prev => ({
                    ...prev,
                    documentTemplatesExtraDetails: {
                        civilActionComplaintForDivorce: result.data.documentTemplatesExtraDetails.civilActionComplaintForDivorce
                    }
                }))
                setSubmitted(true)
            } else {
                alert('Error saving data.')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error saving data.')
        } finally {
            setSaving(false)
        }
    }


    const [selectedJudgmentDemands, setSelectedJudgmentDemands] = useState([])
    const [customJudgmentDemands, setCustomJudgmentDemands] = useState([])

    const judgmentOptions = [
        "The plaintiff demands child support payments.",
        "The plaintiff requests sole custody of children.",
        "The plaintiff seeks an equitable distribution of marital assets.",
        "The plaintiff asks for spousal support for a period of 5 years.",
        "The plaintiff requests reimbursement for legal fees."
    ]

    useEffect(() => {
        if (clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands) {
            setSelectedJudgmentDemands(
                clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands.map(d => d.demand)
            )
        }
    }, [clientData])

    const toggleJudgmentDemand = (sentence) => {
        setSelectedJudgmentDemands(prev =>
            prev.includes(sentence) ? prev.filter(item => item !== sentence) : [...prev, sentence]
        )
    }

    const addCustomJudgmentDemand = () => {
        setCustomJudgmentDemands([...customJudgmentDemands, { id: Date.now(), demand: '' }])
    }

    const updateCustomJudgmentDemand = (id, value) => {
        setCustomJudgmentDemands(prev =>
            prev.map(demand => (demand.id === id ? { ...demand, demand: value } : demand))
        )
    }

    const handleSaveJudgmentDemands = async () => {
        try {
            const response = await fetch('/api/saveDocumentTemplates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    civilActionComplaintForDivorceJudgementDemands: [
                        ...selectedJudgmentDemands.map(demand => ({ demand })),
                        ...customJudgmentDemands.map(d => ({ demand: d.demand }))
                    ],
                    documentName: 'civilActionComplaintForDivorceJudgementDemands',
                    id
                })
            });

            if (response.ok) {
                alert('Judgment Demands saved successfully!');
                setShowSavedJudgments(true);  // Hide Save button and display list
            } else {
                alert('Error saving judgment demands.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving judgment demands.');
        }
    };

    return (<div className='p-4 flex flex-col min-w-screen min-h-screen w-full h-screen'>
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
        <div className='mt-8'>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    The Plaintiff, {clientData.plaintiff.firstName} {clientData.plaintiff.lastName}, resides
                    at {clientData.plaintiff.address1},
                    in the City of {clientData.plaintiff.city} and the State of {clientData.plaintiff.state}.
                </li>
                <li>
                    Plaintiff was lawfully married
                    to {clientData.defendant.firstName} {clientData.defendant.lastName} on {clientData.marriage.dateOfMarriage}
                    in {clientData.marriage.cityOfMarriage}, {clientData.marriage.stateOfMarriage}.
                </li>
                <li>
                    There are {clientData.children.count > 0 ? clientData.children.count : 'no'} children born of
                    marriage.
                </li>

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
                            <TableCell>{user.dob ? `${getMonth(user.dob) + 1}-${getDate(user.dob)}-${getYear(user.dob)}` : ''}</TableCell>
                            <TableCell className='text-right'>{user.sex}</TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>)}

                {submitted ? (clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorce.map((item, index) => (
                    <li key={index}>{item.title}: {item.details}</li>))) : (<>
                    <Button onClick={addTextBox}>Add Textbox</Button>
                    {textBoxes.map(box => (<div key={box.id} className='border p-4 rounded-lg shadow'>
                        <Label>Title</Label>
                        <Input value={box.title}
                               onChange={e => handleChange(box.id, 'title', e.target.value)}/>
                        <Label>Details</Label>
                        <Textarea value={box.details}
                                  onChange={e => handleChange(box.id, 'details', e.target.value)}/>
                    </div>))}
                    <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                </>)}
                <li>The plaintiff and the defendant in the matter have been parties to the following prior action:
                    <div className={`ml-4 mt-4`}>Caption of the
                        case: {clientData.courtDecision.previous.caseName}</div>
                    <div className={`ml-4`}>Docket No.: {clientData.courtDecision.previous.docketNumber}</div>
                </li>
            </ol>
            <div className="mt-4">
                {showSavedJudgments ? (
                    <ul className="list-disc pl-5">
                        {selectedJudgmentDemands.map((demand, index) => (
                            <li key={index} className="mt-1">{demand}</li>
                        ))}
                        {customJudgmentDemands.map((demand, index) => (
                            <li key={`custom-${index}`} className="mt-1">{demand.demand}</li>
                        ))}
                    </ul>
                ) : (
                    <>
                        {judgmentOptions.map((option, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <Checkbox
                                    checked={selectedJudgmentDemands.includes(option)}
                                    onCheckedChange={() => toggleJudgmentDemand(option)}
                                />
                                <Label>{option}</Label>
                            </div>
                        ))}

                        {customJudgmentDemands.map((demand) => (
                            <div key={demand.id} className='mt-2'>
                                <Input
                                    value={demand.demand}
                                    placeholder='Enter custom demand...'
                                    onChange={(e) => updateCustomJudgmentDemand(demand.id, e.target.value)}
                                />
                            </div>
                        ))}

                        {!showSavedJudgments && (
                            <Button className='mt-4' onClick={handleSaveJudgmentDemands}>
                                Save Judgment Demands
                            </Button>
                        )}
                    </>
                )}
            </div>
    </div>
</div>)
}

export default Page
