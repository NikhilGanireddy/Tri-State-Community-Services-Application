// ComplaintForDivorcePage.jsx – updated with edit & delete functionality for dynamic sections

'use client'
import {useEffect, useRef, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {usePathname} from 'next/navigation'
import {format, getDate, getMonth, getYear} from 'date-fns'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Checkbox} from "@/components/ui/checkbox"
import {useToast} from "@/hooks/use-toast"
import {Trash2} from 'lucide-react'

/*************************************************
 * 1. UTILITY – pristine client data skeleton    *
 *************************************************/
const emptyClient = {
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
    },
    defendant: {
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
        fault: ''
    },
    marriage: {dateOfMarriage: null, cityOfMarriage: '', stateOfMarriage: '', dateOfSeparation: null},
    children: {count: 1, details: [{id: '0', name: '', dob: null, placeOfBirth: '', ssn: '', sex: ''}]},
    custody: {
        physicalCustody: '',
        legalCustody: '',
        visitationLimitation: '',
        childSupport: '',
        supportAmount: '',
        supportFrequency: ''
    },
    courtDecision: {
        previous: {docketNumber: '', caseName: '', county: ''}, current: {docketNumber: '', caseName: '', county: ''}
    },
    realEstateDetails: {
        properties: [{description: '', equity: ''}, {description: '', equity: ''}, {description: '', equity: ''}],
        personalProperty: {defendant: '', plaintiff: ''}
    },
    insurance: {
        hasInsurance: false, details: {
            life: {company: '', policy: ''},
            auto: {company: '', policy: ''},
            health: {company: '', policy: '', group: '', throughEmployment: false},
            homeowners: {company: '', policy: ''}
        }
    },
    licenses: {
        driversLicense: {number: '', stateOfIssue: ''},
        employerDetails: {name: '', contact: '', address: ''},
        professionalLicense: {details: ''}
    },
    biographicDetails: {gender: '', race: '', height: '', weight: '', eyeColor: '', hairColor: ''},
    referralSource: {media: '', nameOfMedia: ''},
    sheriffAddress: {addressLine1: '', addressLine2: '', city: '', state: '', zip: '', notes: ''},
    serviceFee: '',
    documentTemplatesExtraDetails: {
        civilActionComplaintForDivorce: [],
        civilActionComplaintForDivorceJudgementDemands: [],
        acknowledgementOfServices: [],
        martialSettlementAgreement: []
    }
}

/*************************************************
 * 2. PAGE COMPONENT                            *
 *************************************************/
const Page = () => {
    /* ─────────────────────────── basics ─────────────────────────── */
    const pathname = usePathname().split('/')
    // client/[id]/complaint-for-divorce -> penultimate piece is the document id
    const id = pathname[pathname.length - 2]
    const {toast} = useToast()

    /* ─────────────────────────── state ─────────────────────────── */
    const [clientData, setClientData] = useState(emptyClient)

    /** Sections (formerly "textBoxes") */
    const [sections, setSections] = useState([])            // always the working copy
    const originalSections = useRef([])                     // snapshot for CANCEL
    const [isEditingSections, setIsEditingSections] = useState(false)
    const [savingSections, setSavingSections] = useState(false)

    /** Judgment Demands */
    const judgmentOptions = ["The plaintiff demands child support payments.", "The plaintiff requests sole custody of children.", "The plaintiff seeks an equitable distribution of marital assets.", "The plaintiff asks for spousal support for a period of 5 years.", "The plaintiff requests reimbursement for legal fees.", "Dissolving the marraiage between the parties", "Awarding Physical and Legal custody of the children to the Plaintiff and Defendant as per the attached agreement", "Ordering that defendant pay child support to plaintiff", "Ordering Plaintiff and Defendant to continue to mutually determine the amount of time that the children will spend with each parent as per the attached agreement.", "Ordering the Defendant to continue to pay child support to the Plaintiff as per the attached agreement.", "Incorporating the attached Property Settlement Agreement into Final Judgement of Divorce.", "Granting such relief as the count may deem equitable and just."]
    const [selectedJudgmentDemands, setSelectedJudgmentDemands] = useState([])
    const [customJudgmentDemands, setCustomJudgmentDemands] = useState([])
    const originalJudgmentDemands = useRef([])
    const [isEditingJudgments, setIsEditingJudgments] = useState(false)
    const [savingJudgments, setSavingJudgments] = useState(false)

    /** Printing */
    const [isPrinting, setIsPrinting] = useState(false)

    /* ─────────────────────────── helpers ─────────────────────────── */
    const addSection = () => {
        setSections(prev => [...prev, {id: Date.now(), title: '', details: ''}])
    }

    const updateSection = (id, field, value) => {
        setSections(prev => prev.map(s => s.id === id ? {...s, [field]: value} : s))
    }

    const deleteSection = (id) => {
        setSections(prev => prev.filter(s => s.id !== id))
    }

    const toggleJudgmentDemand = (sentence) => {
        setSelectedJudgmentDemands(prev => prev.includes(sentence) ? prev.filter(item => item !== sentence) : [...prev, sentence])
    }
    const addCustomJudgmentDemand = () => {
        setCustomJudgmentDemands(prev => [...prev, {id: Date.now(), demand: ''}])
    }
    const updateCustomJudgmentDemand = (id, value) => {
        setCustomJudgmentDemands(prev => prev.map(d => d.id === id ? {...d, demand: value} : d))
    }
    const deleteCustomJudgmentDemand = (id) => {
        setCustomJudgmentDemands(prev => prev.filter(d => d.id !== id))
    }

    /* ─────────────────────────── DB I/O ─────────────────────────── */
    /** fetch once */
    useEffect(() => {
        if (!id) return

        (async () => {
            try {
                const res = await fetch(`/api/getClientById/${id}`)
                if (!res.ok) throw new Error('Failed to fetch client data')
                const data = await res.json()
                setClientData(data)
                console.log(data)

                // complaint-for-divorce sections
                const dbSections = data.documentTemplatesExtraDetails?.civilActionComplaintForDivorce || []
                const mapped = dbSections.map((item, index) => ({...item, id: Date.now() + index}))
                setSections(mapped)
                originalSections.current = mapped

                // judgment demands (split db into default + custom)
                const dbJudgments = data.documentTemplatesExtraDetails?.civilActionComplaintForDivorceJudgementDemands || []
                const defaults = dbJudgments.filter(d => judgmentOptions.includes(d.demand)).map(d => d.demand)
                const customs = dbJudgments.filter(d => !judgmentOptions.includes(d.demand)).map(d => ({
                    id: Date.now() + Math.random(), demand: d.demand
                }))
                setSelectedJudgmentDemands(defaults)
                setCustomJudgmentDemands(customs)
                originalJudgmentDemands.current = {defaults, customs}

                // tab title for nicer UX 🎀
                if (data?.plaintiff?.firstName && data?.defendant?.firstName) {
                    document.title = `${data.plaintiff.firstName} Vs ${data.defendant.firstName} | Complaint For Divorce`
                }
            } catch (err) {
                console.error(err)
                toast({title: 'Error', description: 'Could not load client data'})
            }
        })()
    }, [id])

    /** save sections (create OR update) */
    const handleSaveSections = async () => {
        setSavingSections(true)
        try {
            const res = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    id, documentName: 'civilActionComplaintForDivorce', civilActionComplaintForDivorce: sections
                })
            })
            if (!res.ok) throw new Error('Network')
            const updated = await res.json()
            setClientData(updated.data)
            originalSections.current = sections
            setIsEditingSections(false)
            toast({title: 'Success', description: 'Sections saved'})
        } catch (err) {
            console.error(err)
            toast({title: 'Error', description: 'Problem saving sections'})
        } finally {
            setSavingSections(false)
        }
    }

    /** save judgment demands */
    const handleSaveJudgments = async () => {
        setSavingJudgments(true)
        try {
            const res = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    id,
                    documentName: 'civilActionComplaintForDivorceJudgementDemands',
                    civilActionComplaintForDivorceJudgementDemands: [...selectedJudgmentDemands.map(d => ({demand: d})), ...customJudgmentDemands.map(d => ({demand: d.demand}))]
                })
            })
            if (!res.ok) throw new Error('Network')
            const updated = await res.json()
            setClientData(updated.data)
            originalJudgmentDemands.current = {defaults: selectedJudgmentDemands, customs: customJudgmentDemands}
            setIsEditingJudgments(false)
            toast({title: 'Success', description: 'Judgment demands saved'})
        } catch (err) {
            console.error(err)
            toast({title: 'Error', description: 'Problem saving judgment demands'})
        } finally {
            setSavingJudgments(false)
        }
    }

    /* ─────────────────────────── print helper ─────────────────────────── */
    const handlePrint = () => {
        setIsPrinting(true)
        setTimeout(() => {
            window.print()
            window.onafterprint = () => setIsPrinting(false)
        }, 2000)
    }

    /*************************************************
     * 3. RENDER                                    *
     *************************************************/


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
                    <h1 className='text-2xl text-center font-bold'>COMPLAINT FOR DIVORCE</h1>
                    <h2 className='capitalize text-center'>{clientData.defendant?.fault === "No Fault" ? 'Based on 18 Months Separation' : "based on irreconcilable differences"}</h2>
                    <h2 className={`text-center`}>{clientData.defendant?.fault === "No Fault" ? '(No Fault)' : "Pro/Se"}</h2>
                </div>
            </div>

            {/* Body Content */}
            <div className='mt-8'>
                <ol className='list-inside list-decimal flex flex-col space-y-4'>
                    <li>
                        The
                        Plaintiff,{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                        resides
                        at {clientData.plaintiff.address1},
                        in the City of {clientData.plaintiff.city} and the State of {clientData.plaintiff.state} by way
                        of
                        complaint against the defendant, says:
                    </li>
                    <li>
                        Plaintiff was lawfully married
                        to {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                        the defendant herein, in a
                        civil ceremony on {format(new Date(clientData?.marriage?.dateOfMarriage), 'PPP')} {" "}
                        in {clientData.marriage.cityOfMarriage},{' '}
                        {clientData.marriage.stateOfMarriage}.
                    </li>
                    <li className={``}>
                        {clientData.defendant?.fault === "No Fault" ? `The parties separated on or about ${format(new Date(clientData?.marriage?.dateOfSeparation), 'PPP')}. Ever since the time and for more than 18 consecutive months, the parties have lived separately and apart and in different locations. the separation has continued to the present time and there is no reasonable prospect of reconciliation` : `For more than one year before the date of filling of this complaint, the plaintiff has been a bona fide resident of the state of the New Jersey and the County of ${clientData.plaintiff.county}`}
                    </li>
                    <li className={``}>
                        {clientData.defendant?.fault === "No Fault" ? `At the point at which plaintiff and defendant had lived separately for 18 months, Plaintiff was a bonafide resident of the State of ${clientData.plaintiff.state}, and has ever since and for more than one year next proceeding the commencement of this action, continued to be such a bonafide resident` : `Plaintiff and defendant have experienced Irreconcilable Differences for a period of six months or more. These irreconcilable differences have caused the breakdown of the marriage. There is no hope of reconciliation between the Plaintiff and the Defendant. It appears to the Plaintiff that this marriage should be dissolved.`}
                    </li>
                    <li className={``}>
                        {clientData.defendant?.fault === "No Fault" ? `The defendant, ${clientData.defendant.firstName} ${clientData.defendant.middleName} ${clientData.defendant.lastName}, resides at ${clientData.defendant.address1}, ${clientData.defendant.address2}, ${clientData.defendant.city}, ${clientData.defendant.state}, ${clientData.defendant.zip}.` : `At the point at which plaintiff and defendant experienced irreconcilable differences for a period of six months, plaintiff lives at ${clientData.plaintiff.address1}, ${clientData.plaintiff.address2}, ${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip}`}
                    </li>
                    <li className={``}>
                        {clientData.defendant?.fault === "No Fault" ? `At the expiration of the 18-month separation, plaintiff resided ${clientData.plaintiff.address1}, ${clientData.plaintiff.address2}, ${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip} was a resident of the state of ${clientData.plaintiff.state} when the cause of action arose.` : `The defendant, ${clientData.defendant.firstName} ${clientData.defendant.middleName} ${clientData.defendant.lastName} resides at ${clientData.defendant.address1}, ${clientData.defendant.address2}, ${clientData.defendant.city}, ${clientData.defendant.state}, ${clientData.defendant.zip}`}
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
                                <TableHead className='text-right'>SSN</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientData.children.details.map(user => (<TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.placeOfBirth}</TableCell>
                                <TableCell>
                                    {user.dob ? `${getMonth(user.dob) + 1}-${getDate(user.dob)}-${getYear(user.dob)}` : ''}
                                </TableCell>
                                <TableCell className='text-right'>{user.ssn}</TableCell>
                            </TableRow>))}
                        </TableBody>
                    </Table>)}

                    {/* 8. Additional sections from DB */}
                    {!isEditingSections && sections.length > 0 && sections.map(item => (
                        <li key={item.id}>{item.title}: {item.details}</li>))}

                    {/* SECTION EDIT MODE */}
                    {isEditingSections && (<div className="space-y-4">
                            {sections.map(sec => (<div key={sec.id} className="border p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <Label>Title</Label>
                                        <Input value={sec.title}
                                               onChange={e => updateSection(sec.id, 'title', e.target.value)}/>
                                        <Label className="mt-2 block">Details</Label>
                                        <Textarea value={sec.details}
                                                  onChange={e => updateSection(sec.id, 'details', e.target.value)}/>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteSection(sec.id)}>
                                        <Trash2 size={16}/>
                                    </Button>
                                </div>
                            </div>))}
                            <Button onClick={addSection}>Add Section</Button>
                            <div className="flex gap-2 mt-4">
                                <Button disabled={savingSections} onClick={() => {
                                    console.log('clientData.sections:', sections);
                                    handleSaveSections();
                                }}>
                                    {savingSections ? 'Saving…' : 'Save'}
                                </Button>
                                <Button variant="secondary" onClick={() => {
                                    setSections(originalSections.current);
                                    setIsEditingSections(false);
                                }}>Cancel</Button>
                            </div>
                        </div>)}

                    {/* EDIT SECTIONS BUTTON (shows only when not editing) */}
                    {!isEditingSections && (<div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="print:hidden"
                            onClick={() => setIsEditingSections(true)}
                        >
                            Edit/Manage Sections
                        </Button>
                    </div>)}

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

                    {/* display‑only mode */}
                    {!isEditingJudgments && (<>
                        <ol className="list-decimal pl-5 mb-6">
                            {/* NEW: show each demand once */}
                            {[...new Set([...selectedJudgmentDemands, ...customJudgmentDemands.map(d => d.demand)])].map((d, i) => (
                                <li key={i} className="mt-1">{d}</li>))}
                        </ol>

                        <Button
                            variant="outline"
                            size="sm"
                            className="print:hidden"
                            onClick={() => setIsEditingJudgments(true)}
                        >
                            Edit/Manage Judgments
                        </Button>
                    </>)}

                    {/* edit mode */}
                    {isEditingJudgments && (<div className="space-y-4">
                        {/* default checkbox list */}
                        {judgmentOptions.map((opt, idx) => (<div key={idx} className='flex items-center gap-2'>
                            <Checkbox checked={selectedJudgmentDemands.includes(opt)}
                                      onCheckedChange={() => toggleJudgmentDemand(opt)}/>
                            <Label>{opt}</Label>
                        </div>))}

                        {/* custom demands */}
                        <div className="space-y-3">
                            {customJudgmentDemands.map(cd => (<div key={cd.id} className='flex items-center gap-2'>
                                <Input value={cd.demand}
                                       onChange={e => updateCustomJudgmentDemand(cd.id, e.target.value)}
                                       className='flex-1'/>
                                <Button variant='ghost' size='icon'
                                        onClick={() => deleteCustomJudgmentDemand(cd.id)}><Trash2
                                    size={16}/></Button>
                            </div>))}
                        </div>
                        <Button onClick={addCustomJudgmentDemand}>Add Custom Demand</Button>
                        <div className='flex gap-2 mt-4'>
                            <Button disabled={savingJudgments}
                                    onClick={handleSaveJudgments}>{savingJudgments ? 'Saving…' : 'Save'}</Button>
                            <Button variant="secondary" onClick={() => {
                                setSelectedJudgmentDemands(originalJudgmentDemands.current.defaults)
                                setCustomJudgmentDemands(originalJudgmentDemands.current.customs)
                                setIsEditingJudgments(false)
                            }}>Cancel</Button>
                        </div>
                    </div>)}

                    <div className={`flex flex-row gap-2 mt-32 w-full justify-end `}>
                        <div>

                        </div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <div className={`w-64 h-[1.5px] bg-black`}/>
                            <h2>(Signature of the Plaintiff) <span className={`text-`}> Plaintiff</span></h2>
                        </div>
                    </div>
                    <div className={`flex flex-row gap-2 mt-12 w-full justify-end `}>
                        <div>
                        </div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2 className={``}> {`${clientData.plaintiff.firstName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.lastName}`}</h2>
                            <div className={`w-64 h-[1.5px]  -mt-2 bg-black`}/>
                            <h2 className={``}>(Plaintiff's Name, Printed) <span className={`text-`}> Plaintiff</span>
                            </h2>
                        </div>
                    </div>
                    <div className={`flex flex-row gap-2 mt-12 w-full justify-start `}>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2> Dated: ______________________</h2>
                        </div>
                        <div>

                        </div>

                    </div>

                    {/* Print Button (delayed by 2s, disabled while waiting) */}
                    {isPrinting ? (" ") : (<div className="mt-6">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="print:hidden"
                        >
                            Print Document
                        </Button>
                    </div>)}
                </div>
            </div>
        </div>)
}

export default Page