'use client'
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {usePathname} from 'next/navigation'
import {format, getDate, getMonth, getYear} from "date-fns";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";

const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 2]
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
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


    return (<div className='p-4 text-xs flex flex-col min-w-screen min-h-screen w-full h-screen font-sans'>
        {/* Top Section */}


        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.lastName}</h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                    <h2>{clientData.plaintiff.mobile}</h2>
                    <div className='bg-black text-black w-full h-[1px] my-3'/>
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
                    <h2>COUNTY</h2>
                    <h2>DOCKET NUMBER NONE</h2>
                    {clientData.defendant.fault}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-6'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>COMPLAINT FOR DIVORCE</h1>
                <h2 className='capitalize'>{clientData.defendant?.fault === "No Fault" ? 'Based on 18 Months Separation' : "based on irreconcilable differences"}</h2>
                <h2 className={`text-center`}>{clientData.defendant?.fault === "No Fault" ? '(No Fault)' : "Pro/Se"}</h2>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8'>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    The Plaintiff, {clientData.plaintiff.firstName} {clientData.plaintiff.lastName}, resides
                    at {clientData.plaintiff.address1},
                    in the City of {clientData.plaintiff.city} and the State of {clientData.plaintiff.state} by way of
                    complaint against the defendant, says:
                </li>
                <li>
                    Plaintiff was lawfully married
                    to {clientData.defendant.firstName} {clientData.defendant.lastName}, the defendant herein, in a
                    civil ceremony on{' '}
                    {clientData.marriage.dateOfMarriage} in {clientData.marriage.cityOfMarriage},{' '}
                    {clientData.marriage.stateOfMarriage}.
                </li>
                <li className={``}>
                    {clientData.defendant?.fault === "No Fault" ? `The parties separated on or about October 2019. Ever since the time and for more than 18 consecutive months, the parties have lived separately and apart and in different locations. the separation has continued to the present time and there is no reasonable prospect of reconciliation` : `For more than one year before the date of filling of this complaint, the plaintiff has been a bona fide resident of the state of the New Jersey and the County of county`}
                </li>
                <li className={``}>
                    {clientData.defendant?.fault === "No Fault" ? `At the point at which plaintiff and defendant had lived separately for 18 months, Plaintiff was a bonafide resident of the State of ${clientData.plaintiff.state}, and has ever since and for more than one year next proceeding the commencement of this action, continued to be such a bonafide resident` : `Plaintiff and defendant have experienced Irreconcilable Differences for a period of six months or more. These irreconcilable differences have caused the breakdown of the marriage. There is no hope of reconciliation between the Plaintiff and the Defendant. It appears to the Plaintiff that this marriage should be dissolved.`}
                </li>
                <li className={``}>
                    {clientData.defendant?.fault === "No Fault" ? `The defendant, ${clientData.defendant.firstName} ${clientData.defendant.middleName} ${clientData.defendant.lastName} resides at ${clientData.defendant.address1}, ${clientData.defendant.address2}, ${clientData.defendant.city}, ${clientData.defendant.state}, ${clientData.defendant.zip}.` : `At the point at which plaintiff and defendant experienced irreconcilable differences for a period of six months, plaintiff lives at ${clientData.plaintiff.address1}, ${clientData.plaintiff.address2}, ${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip}`}
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
            {/*<div className='mt-8 border-t pt-4'>*/}
            {/*    <h2 className="font-bold mb-3">WHEREFORE THE PLAINTIFF DEMANDS JUDGMENT:</h2>*/}
            {/*    <ol className="list-decimal pl-5 mb-6">*/}
            {/*        {selectedJudgmentDemands.map((demand, index) => (<li key={`selected-${index}`} className="mt-1">*/}
            {/*            {demand}*/}
            {/*        </li>))}*/}
            {/*        {customJudgmentDemands.map((demand, index) => (<li key={`custom-${index}`} className="mt-1">*/}
            {/*            {demand.demand}*/}
            {/*        </li>))}*/}
            {/*    </ol>*/}

            {/*    /!* Hide "Add or Remove Judgments" after saving *!/*/}
            {/*    {!judgmentDemandsSaved && (<>*/}
            {/*        <h2 className="font-bold mb-2">Add or Remove Judgments</h2>*/}
            {/*        {judgmentOptions.map((option, index) => (<div key={index} className='flex items-center gap-2 mb-1'>*/}
            {/*            <Checkbox*/}
            {/*                checked={selectedJudgmentDemands.includes(option)}*/}
            {/*                onCheckedChange={() => toggleJudgmentDemand(option)}*/}
            {/*            />*/}
            {/*            <Label>{option}</Label>*/}
            {/*        </div>))}*/}

            {/*        <div className="mt-4">*/}
            {/*            <Button onClick={addCustomJudgmentDemand}>*/}
            {/*                Add Custom Demand*/}
            {/*            </Button>*/}
            {/*            {customJudgmentDemands.map((demand) => (*/}
            {/*                <div key={demand.id} className='mt-3 flex items-center gap-2'>*/}
            {/*                    <Input*/}
            {/*                        value={demand.demand}*/}
            {/*                        placeholder='Enter custom demand...'*/}
            {/*                        onChange={(e) => updateCustomJudgmentDemand(demand.id, e.target.value)}*/}
            {/*                    />*/}
            {/*                </div>))}*/}
            {/*        </div>*/}

            {/*        <div className="mt-4">*/}
            {/*            <Button onClick={handleSaveJudgmentDemands}>*/}
            {/*                Save Judgment Demands*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </>)}*/}

            {/*    <div className={`flex flex-row gap-2 mt-32 w-full justify-end `}>*/}
            {/*        <div>*/}

            {/*        </div>*/}
            {/*        <div className={`flex flex-col gap-2 justify-start`}>*/}
            {/*            <div className={`w-64 h-[2px] bg-black`}/>*/}
            {/*            <h2>(Signature of the Plaintiff) <span className={`text-sm`}> Plaintiff</span></h2>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={`flex flex-row gap-2 mt-12 w-full justify-end `}>*/}
            {/*        <div>*/}
            {/*        </div>*/}
            {/*        <div className={`flex flex-col gap-2 justify-start`}>*/}
            {/*            <h2 className={``}> {`${clientData.plaintiff.lastName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.firstName}`}</h2>*/}
            {/*            <div className={`min-w-64 w-full h-[2px]  -mt-2 bg-black`}/>*/}
            {/*            <h2 className={``}>(Plaintiff's Name, Printed) <span className={`text-sm`}> Plaintiff</span>*/}
            {/*            </h2>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={`flex flex-row gap-2 mt-12 w-full justify-start `}>*/}
            {/*        <div className={`flex flex-col gap-2 justify-start`}>*/}
            {/*            <h2> Dated: <span className={`underline`}>{format(Date.now(), 'PPP')}</span></h2>*/}
            {/*        </div>*/}
            {/*        <div>*/}

            {/*        </div>*/}

            {/*    </div>*/}

            {/*    /!* Print Button (delayed by 2s, disabled while waiting) *!/*/}
            {/*    {isPrinting ? (" ") : (<div className="mt-6">*/}
            {/*        <Button variant="outline" onClick={handlePrint}>*/}
            {/*            Print Document*/}
            {/*        </Button>*/}
            {/*    </div>)}*/}
            {/*</div>*/}
        </div>
    </div>)

}

export default Page