'use client'
import {useEffect, useRef, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'
import {format} from 'date-fns'
import {useToast} from "@/hooks/use-toast"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

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
    const [textBoxes, setTextBoxes] = useState([])       // draft array
    const [submitted, setSubmitted] = useState(false)    // has been saved?
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const closeEditor = () => {
        setEditMode(false);      // switch back to read‑only view
    };
    // --- debounce helpers ---
    const firstLoad = useRef(true);          // skip autosave on initial mount
    const debounceTimer = useRef(null);      // store setTimeout id

    const autoSave = async (boxes) => {
        setSaving(true);
        try {
            const res = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    id, documentName: 'martialSettlementAgreement', martialSettlementAgreement: boxes,
                }),
            });
            if (!res.ok) throw new Error('network');

            const result = await res.json();
            // refresh local cache
            setClientData(prev => ({
                ...prev, documentTemplatesExtraDetails: {
                    ...prev.documentTemplatesExtraDetails,
                    martialSettlementAgreement: result.data.documentTemplatesExtraDetails.martialSettlementAgreement,
                },
            }));
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            toast({title: 'Error', description: 'Failed to save data.'});
        } finally {
            setSaving(false);
        }
    };

    const addTextBox = () => {
        setTextBoxes(prev => [...prev, {id: Date.now(), title: '', details: ''}])
    }

    /* Delete a row */
    const deleteTextBox = (id) => {
        setTextBoxes(prev => prev.filter(box => box.id !== id))
    }

    /* Field change */
    const handleChange = (id, field, value) => {
        setTextBoxes(prev => prev.map(box => (box.id === id ? {...box, [field]: value} : box)))
    }

    /* Persist to DB */
    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/saveDocumentTemplates', {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                    id, documentName: 'martialSettlementAgreement', martialSettlementAgreement: textBoxes
                })
            })

            if (!res.ok) throw new Error('Network response was not ok')
            const result = await res.json()

            // update local cache + UI flags
            setClientData(prev => ({
                ...prev, documentTemplatesExtraDetails: {
                    ...prev.documentTemplatesExtraDetails,
                    martialSettlementAgreement: result.data.documentTemplatesExtraDetails.martialSettlementAgreement
                }
            }))
            toast({title: 'Success', description: 'Saved successfully!'})
            setSubmitted(true)
            setEditMode(false)
        } catch (err) {
            console.error(err)
            toast({title: 'Error', description: 'Failed to save data.'})
        } finally {
            setSaving(false)
        }
    }
    /* Start editing an existing document */
    const startEdit = () => {
        const existing = clientData.documentTemplatesExtraDetails.martialSettlementAgreement || []
        const hydrated = existing.map((item, idx) => ({
            id: Date.now() + idx, title: item.title, details: item.details
        }))
        setTextBoxes(hydrated)
        setSubmitted(false)
        setEditMode(true)
    }

    /** Fetch client data on mount */
    useEffect(() => {
        if (!id) return

        (async () => {
            try {
                const res = await fetch(`/api/getClientById/${id}`)
                if (!res.ok) throw new Error('Failed to fetch client')
                const data = await res.json()
                setClientData(data)
                setSubmitted((data.documentTemplatesExtraDetails?.martialSettlementAgreement || []).length !== 0)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [id])

    useEffect(() => {
        if (firstLoad.current) {          // skip first render
            firstLoad.current = false;
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => autoSave(textBoxes), 600); // 600 ms

        return () => debounceTimer.current && clearTimeout(debounceTimer.current);
    }, [textBoxes]);
    console.log(submitted)

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
                    <div className='bg-black text-black w-full h-[1px] my-3'/>
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
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-6'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>MARTIAL SETTLEMENT AGREEMENT</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8'>
            <p>

                I, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                hereinafter referred to as ‘Plaintiff,’
                and {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                hereinafter referred to as ‘Defendant,’ hereby agree to the following:
            </p>
            <h1 className={`font-bold text-base my-8`}>Preliminary Matter:</h1>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    Plaintiff and Defendant were lawfully married
                    on {format(new Date(clientData?.marriage?.dateOfMarriage), 'PPP')},
                    in {clientData.marriage.cityOfMarriage}, {clientData.marriage.stateOfMarriage} .Because certain
                    irreconcilable problems have developed between Plaintiff and Defendant, they have agreed to live
                    separately and apart, have filed for divorce, and are attempting to resolve the property issues
                    between them without going to trial.
                </li>
                <li>Plaintiff and Defendant have made a complete, fair, and accurate disclosure to each other of all
                    financial matters affecting this agreement.
                </li>

                <li className={``}>
                    This agreement is intended to be final disposition of the matters addressed herein and may be used
                    as evidence and incorporated into a final decree of divorce or dissolution.
                </li>
                <li className={``}>
                    Should a dispute arise regarding the enforcement of this agreement, the prevailing party will be
                    entitled to his or her reasonable costs and attorney’s fees.
                </li>

                {submitted && !editMode ? (<>
                        {clientData.documentTemplatesExtraDetails.martialSettlementAgreement.map((item, idx) => (
                            <li key={idx} className='my-4'>
                                <span className=''>{item.title}:</span> {item.details}
                            </li>))}
                        <Button variant='outline' onClick={startEdit} className='mt-4 print:hidden'>Add Text Box</Button>
                    </>) : (<>
                        {/* toolbar */}
                        <div className='flex gap-2 mb-4'>
                            <Button className=' print:hidden' onClick={addTextBox}>Add Textbox</Button>

                            {saving && (<span className='text-xs text-muted-foreground self-center'>Saving…</span>)}
                            {editMode && (<Button variant='outline' onClick={closeEditor}>
                                    Done
                                </Button>)}
                        </div>

                        {/* editor */}
                        {textBoxes.map(box => (<div key={box.id} className='border rounded-lg shadow p-4 my-2'>
                                <div className='flex justify-between items-center mb-2'>
                                    <Label className='font-medium'>Title</Label>
                                    <Button variant='destructive' size='sm'
                                            onClick={() => deleteTextBox(box.id)}>Delete</Button>
                                </div>
                                <Input
                                    value={box.title}
                                    onChange={e => handleChange(box.id, 'title', e.target.value)}
                                    placeholder='Section title…'
                                />

                                <Label className='font-medium mt-4 block'>Details</Label>
                                <Textarea
                                    value={box.details}
                                    onChange={e => handleChange(box.id, 'details', e.target.value)}
                                    placeholder='Enter details…'
                                    className='mt-1'
                                />
                            </div>))}
                    </>)}
            </ol>


            <div className='mt-8 border-t pt-4'>
                {/*<h2 className="font-bold mb-3">WHEREFORE THE PLAINTIFF DEMANDS JUDGMENT:</h2>*/}
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

                <p className={`font-bold mt-4`}>Attestation:</p>
                <div className={`font-bold flex flex-col gap-4 my-8 w-full justify-start `}>
                    <div className={`flex space-x-2 items-end justify-start`}>Signed this <div
                        className={`w-24 h-[1px] bg-black`}/> day of <div
                        className={`w-24 h-[1px] bg-black`}/> 20 <div className={`w-8 h-[1px] bg-black`}/></div>
                    <div className={`font-bold`}>By:</div>
                    <div className={`flex flex-col gap-2 justify-start mt-8`}>
                        <div className={`w-64 h-[1px] bg-black -2`}/>
                        <h1> {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h1>
                        <h2><span className={`text-`}> Plaintiff</span></h2>
                    </div>
                    <div>
                        <h1>State of New {clientData.plaintiff.state}</h1>
                        <h1 className={`flex gap-2 justify-start items-end`}>County of <div
                            className={`w-24 h-[1px] bg-black`}/></h1>
                    </div>
                    <div className={`my-4`}>
                        <div className={`flex space-x-2 items-end justify-start`}>Signed before on this <div
                            className={`w-24 h-[1px] bg-black`}/>of <div
                            className={`w-24 h-[1px] bg-black`}/> 20 <div className={`w-8 h-[1px] bg-black`}/></div>
                    </div>
                    <div className={`flex flex-col gap-2 justify-center mt-4`}>
                        <div className={`w-64 h-[1px] bg-black `}/>
                        <h2><span className={`text-`}> Signature of the Notary Public</span></h2>
                    </div>
                </div>
                <div className={` font-bold mt-16`}>
                    <div className={`flex space-x-2 items-end justify-start`}>Signed this <div
                        className={`w-24 h-[1px] bg-black`}/>day of <div
                        className={`w-24 h-[1px] bg-black`}/> 20 <div className={`w-8 h-[1px] bg-black`}/></div>
                </div>
                <div className={` flex flex-col gap-4 mt-12 w-full font-bold `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <div className={`w-64 h-[1px]  -mt-2 bg-black`}/>
                        <h2 className={``}> {`${clientData.defendant.firstName} ${clientData.defendant.middleName} ${clientData.defendant.lastName}`}</h2>

                        <h2 className={``}>Defendant <span className={`text-`}> </span>
                        </h2>
                    </div>
                    <div>
                        <h1>State of __________________</h1>
                        <h1 className={`flex space-x-2 items-end`}>County of __________________</h1>
                    </div>
                    <div className={`flex space-x-2 items-end justify-start`}>Signed before on this <div
                        className={`w-24 h-[1px] bg-black`}/>of <div
                        className={`w-24 h-[1px] bg-black`}/> 20 <div className={`w-8 h-[1px] bg-black`}/></div>

                    <div className={`flex flex-col gap-2 justify-center mt-4`}>
                        <div className={`w-64 h-[1px] bg-black `}/>
                        <h2><span className={`text-`}> Signature of the Notary Public</span></h2>
                    </div>
                </div>

                {/* Print Button (delayed by 2s, disabled while waiting) */}
                {isPrinting ? null : (
                    <Button variant='outline' onClick={handlePrint} className='mt-6 print:hidden'>Print Document</Button>)}
            </div>
        </div>
    </div>)
}

export default Page