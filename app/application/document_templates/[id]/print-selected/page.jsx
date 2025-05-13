'use client'

import {useEffect, useState} from 'react'
import {usePathname, useSearchParams} from 'next/navigation'
import {format, getDate, getMonth, getYear} from 'date-fns'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'

// // import RequestForNonAppearanceJudgementForDivorcePage from '../requestForNonAppearanceJudgementForDivorce/page'
// import MartialSettlementAgreementPage from '../martialSettlementAgreement/page'
// import MilitaryPage from '../military/page'
// import RequestForNameChangePlaintiffPage from '../requestForNameChangePlaintiff/page'
// import RequestForNameChangeDefendantPage from '../requestForNameChangeDefendant/page'
// import FinalJudgementOfDivorcePage from '../finalJudgementOfDivorce/page'
// import CertificationOfVerificationAndNonCollusionPage from '../certificationOfVerificationAndNonCollusion/page'
// import Rule5_4_2hCertificationBySelfPage from '../rule5:4_2(h)CertificationBySelf_RepresentedLitigant/page'
// import CertificationOfNonMilitaryServicePage from '../certificationOfNonMilitaryService/page'
// import PlaintiffAffidavitOfNonMilitaryPage from '../plaintiffAffidavitOfNon_Military/page'
// import DefendantAffidavitOfNonMilitaryPage from '../defendantAffidavitOfNon_Military/page'
// import RequestForCertificationEnterDefaultPage from '../requestForCertification_EnterDefault/page'
// import CertificationOfInternationalDomicilePage from '../certificationOfInternationalDomicile/page'
// import CertificationOfInsurancePage from '../certificationOfInsurance/page'
// // import SamplePage from '../sample/page'
import {Button} from "@/components/ui/button";

export default function PrintSelected() {
    // ─── Hooks (always in the same order) ────────────────────────────
    const pathname = usePathname()
    const params = useSearchParams()

    const id = pathname.split('/')[pathname.split('/').length - 2]
    const docsParam = params.get('docs') || ''
    const docs = docsParam.split(',').filter(Boolean)
    console.log('docs', docs)

    const [clientData, setClientData] = useState(null)

    // fetch data
    useEffect(() => {
        // console.log(id)
        if (!id) return
        fetch(`/api/getClientById/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setClientData(data)
                console.log(data)
                if (data.plaintiff?.firstName && data.defendant?.firstName) {
                    document.title = `${data.plaintiff.firstName} ${data.plaintiff.lastName} Vs ${data.defendant.firstName} ${data.defendant.lastName}`
                }
            })
            .catch(console.error)
    }, [id])

    // auto-print
    // useEffect(() => {
    //     setTimeout(() => window.print(), 500)
    // }, [])

    // ─── Early return until data loads ───────────────────────────────
    if (!clientData) return null

    // ─── Inline Complaint-for-Divorce component ─────────────────────

    const civilActionComplaintForDivorce = () => (<div className={`break-after-page`}>
        {/* Top Section */}
        <div className="w-full flex flex-col justify-between">
            <div className="font-medium capitalize flex flex-row justify-between items-center">
                <div className="w-full">
                    <h2>
                        {clientData.plaintiff.firstName}{' '}
                        {clientData.plaintiff.middleName}{' '}
                        {clientData.plaintiff.lastName}
                    </h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>
                        {clientData.plaintiff.city}, {clientData.plaintiff.state},{' '}
                        {clientData.plaintiff.zip}
                    </h2>
                    <h2>{clientData.plaintiff.mobile}</h2>
                    <div className="bg-black text-black w-full h-[1.5px] my-3"/>
                    <h2>
                        {clientData.plaintiff.firstName}{' '}
                        {clientData.plaintiff.middleName}{' '}
                        {clientData.plaintiff.lastName}
                    </h2>
                    <h2>Plaintiff</h2>
                </div>
                <div className="w-full"/>
            </div>
            <div className="flex flex-row w-full justify-between items-center">
                <div/>
                <div className="font-medium capitalize">
                    <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                    <h2>CHANCERY DIVISION-FAMILY PART</h2>
                    <h2 className="uppercase">
                        COUNTY: {clientData.plaintiff.county}
                    </h2>
                    <h2>DOCKET NUMBER: __________________</h2>
                </div>
            </div>
        </div>

        <h2 className="indent-14">Vs</h2>
        <div className="w-full h-[1.5px] my-6"/>

        <div className="w-full flex justify-between items-end">
            <div className="font-medium capitalize flex flex-col justify-between w-[350px]">
                <h2>
                    {clientData.defendant.firstName}{' '}
                    {clientData.defendant.middleName}{' '}
                    {clientData.defendant.lastName}
                </h2>
                <h2>Defendant</h2>
                <div className="bg-black text-black w-full h-[1.5px] my-3"/>
            </div>
            <div className="font-medium">
                <h1 className="text-2xl text-center">CIVIL ACTION</h1>
                <h1 className="text-2xl text-center font-bold">
                    COMPLAINT FOR DIVORCE
                </h1>
                <h2 className="capitalize text-center">
                    {clientData.defendant.fault === 'No Fault' ? 'Based on 18 Months Separation' : 'based on irreconcilable differences'}
                </h2>
                <h2 className="text-center">
                    {clientData.defendant.fault === 'No Fault' ? '(No Fault)' : 'Pro/Se'}
                </h2>
            </div>
        </div>

        {/* Body Content */}
        <div className="mt-8">
            <ol className="list-inside list-decimal flex flex-col space-y-4">
                <li>
                    The
                    Plaintiff,{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                    resides
                    at {clientData.plaintiff.address1},
                    in the City of {clientData.plaintiff.city} and the State of {clientData.plaintiff.state} by way of
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

                {clientData.children.count > 0 && (<Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Place of Birth</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead className="text-right">SSN</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientData.children.details.map((c, i) => (<TableRow key={i}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell>{c.placeOfBirth}</TableCell>
                            <TableCell>
                                {c.dob ? `${getMonth(c.dob) + 1}-${getDate(c.dob)}-${getYear(c.dob)}` : ''}
                            </TableCell>
                            <TableCell className="text-right">{c.ssn}</TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>)}

                {clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorce.length > 0 && clientData.documentTemplatesExtraDetails.civilActionComplaintForDivorce.map(item => (
                    <li key={item.id}>{item.title}: {item.details}</li>))}
                <li>
                    The plaintiff and defendant have been parties to the following prior
                    action:
                    <div className="ml-4 mt-4">
                        Caption: {clientData.courtDecision.previous.caseName}
                    </div>
                    <div className="ml-4">
                        Docket No.: {clientData.courtDecision.previous.docketNumber}
                    </div>
                </li>
            </ol>

            <div className="mt-8 border-t pt-4">
                <h2 className="font-bold mb-3">
                    WHEREFORE THE PLAINTIFF DEMANDS JUDGMENT:
                </h2>
                <ol className="list-decimal pl-5 mb-6">
                    {clientData.documentTemplatesExtraDetails
                        .civilActionComplaintForDivorceJudgementDemands.map((d, i) => (<li key={i} className="mt-1">
                            {d.demand}
                        </li>))}
                </ol>

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
                        <h2 className={``}>(Plaintiff's Name, Printed) <span
                            className={`text-`}> Plaintiff</span>
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

            </div>
        </div>
    </div>)
    const AcknowledgementOfServices = () => (<div className={`break-after-page`}>
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
                    <h2>DOCKET NUMBER: _____________</h2>
                    {/*{clientData.defendant.fault}*/}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-2xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center font-bold'>ACKNOWLEDGMENT OF SERVICES</h1>
                <h1 className='text-2xl text-center font-bold'>SUMMONS AND COMPLAINTS BY THE</h1>
                <h1 className='text-2xl text-center font-bold'>DEFENDANT AND WAIVER</h1>

                <h2 className='text-center capitalize'>{clientData.defendant?.fault === "No Fault" ? 'Based on 18 Months Separation' : "based on irreconcilable differences"}</h2>
                <h2 className={`text-center`}>{clientData.defendant?.fault === "No Fault" ? '(No Fault)' : "Pro/Se"}</h2>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-8 '>
            <div>
                <p className={`indent-12`}>The undersigned hereby acknowledges service of a copy of the summons and
                    complaint.</p>
                <p>I, the defendant, waive my 35 days to answer the complaint.</p></div>
            {/* Judgment Demands */}
            <div className='mt-8'>
                <div className={`flex flex-row gap-2 mt-8 w-full justify-between items-start `}>
                    <div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2> Date: ________________</h2>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-1 justify-start`}>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`text-sm`}> Defendant</span>
                    </div>
                </div>

                <div className={`flex flex-col mt-12 w-full justify-between items-start `}>
                    <h2> State of &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>
                    <h2> County of  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>

                </div>

                <div className={`flex flex-col gap-2 mt-12 w-full items-start`}>
                    <h2> Signed before me on this</h2>
                    <div className={`flex items-end`}>
                        <div className={` w-12 h-[1.5px] bg-black`}/>
                        <span>day of </span>
                        <div className={` w-40 h-[1.5px] bg-black`}/>
                        <span>20</span>
                        <div className={` w-20 h-[1.5px] bg-black`}/>
                    </div>
                </div>

                <div className={`flex flex-col mt-16 w-full justify-between items-start gap-1`}>
                    <div className={` w-80 h-[1.5px] bg-black`}/>

                    <h2> Signature of the Notary Public</h2>

                </div>


            </div>
        </div>
    </div>)
    const RequestForNonAppearanceJudgementForDivorcePage = () => (<div className={`break-after-page`}>
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
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
                    <h2>DOCKET NUMBER: _____________</h2>
                    {clientData.defendant.fault}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>REQUEST FOR NON-APPEARANCE</h1>
                <h1 className='text-xl text-center font-bold'>JUDGEMENT FOR DIVORCE</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-2 '>
            <div>
                <p className={`indent-12`}>I {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                    Plaintiff,
                    reside
                    at {clientData.plaintiff.address1}, {clientData.plaintiff.address2}, {clientData.plaintiff.city} and
                    the State of {clientData.plaintiff.state}, request a Non-Appearance Judgement for Divorce
                    (Judgement
                    based on papers).</p>
            </div>
            {/* Judgment Demands */}
            <div className='mt'>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-between items-start `}>
                    <div>
                        <div className={`flex flex-col gap-2 justify-start`}>
                            <h2 className={`flex justify-between items-end`}> Date: <span
                                className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/></h2>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-1 justify-start`}>
                        <h2 className={``}></h2>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`text-`}> (Plaintiff's signature) Plaintiff Pro Se</span>
                        <h2 className={` mt-4`}> {`${clientData.plaintiff.lastName} ${clientData.plaintiff.middleName} ${clientData.plaintiff.firstName}`}</h2>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`text-`}> Plaintff's Name printed</span>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    const MartialSettlementAgreementPage = () => (<div className={`break-after-page`}>
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
                    This agreement is intended to be final disposition of the matters addressed herein and may be
                    used
                    as evidence and incorporated into a final decree of divorce or dissolution.
                </li>
                <li className={``}>
                    Should a dispute arise regarding the enforcement of this agreement, the prevailing party will be
                    entitled to his or her reasonable costs and attorney’s fees.
                </li>
                {clientData.documentTemplatesExtraDetails.martialSettlementAgreement.map((item, idx) => (
                    <li key={idx} className='my-4'>
                        <span className=''>{item.title}:</span> {item.details}
                    </li>))}
            </ol>


            <div className='mt-8 border-t pt-4'>
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

            </div>
        </div>
    </div>)
    const MilitaryPage = () => (<div className={`break-after-page`}>
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
                    <h2>DOCKET NUMBER: ______________</h2>
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
                <h1 className='text-2xl text-center font-bold'>MILITARY</h1>
                <h1 className={`text-center`}>{clientData.defendant.fault === "No Fault" ? `NO FAULT` : `IRRECONCILABLE DIFFERENCES`}</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-4'>
            <div className={`uppercase font-bold`}>
                <h1>STATE OF {clientData.plaintiff.state}</h1>
                <h1>county of {clientData.plaintiff.county}</h1>
            </div>
            <div className=' flex flex-col space-y-4 mt-4'>
                <p className={`indent-8`}>
                    I, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                    being of full age and duly sworn according to laws that support affidavits in the
                    State of New Jersey, depose and say:
                </p>
                <p className={`indent-8`}>I am the plaintiff in this case and I am making this affidavit of my spouse
                    military service in support of my complaint for divorce.
                </p>

                <p className={`indent-8`}>
                    I know for my own personal knowledge that my
                    spouse,{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                    is in the United
                    States Military and is residing at the following address:

                    {clientData.defendant.address1} {clientData.defendant.address2}, {clientData.defendant.city}, {clientData.defendant.state} {clientData.defendant.zip} .
                </p>
            </div>

            <div className='mt-8  pt-4'>


                <div className={`w-full flex justify-between font-bold`}>
                    <div className={`flex space-x-2  items-end`}>Date:
                        <div className={`w-32 h-[1.5px]  -mt-2 bg-black`}/>
                    </div>
                    <div className={`font-bold flex space-x-2  items-end`}>Plaintiff:
                        <div className={`w-32 h-[1.5px]  -mt-2 bg-black`}/>
                    </div>
                </div>
                <div className={`font-bold flex flex-col mt-8`}>
                    <h1>State of New Jersey</h1>
                    <h1 className={`flex space-x-2 items-end`}>County of <div
                        className={`w-24 h-[1.5px] bg-black`}/></h1>
                </div>

                <div className={`font-bold flex space-x-2 items-end justify-start mt-8`}>Signed before on this <div
                    className={`w-24 h-[1.5px] bg-black`}/>of <div
                    className={`w-24 h-[1.5px] bg-black`}/> 20 <div className={`w-8 h-[1.5px] bg-black`}/></div>

                <div className={`font-bold flex flex-col gap-2 justify-center mt-8`}>
                    <div className={`w-64 h-[1.5px] bg-black `}/>
                    <h2><span className={`text-`}> Signature of the Notary Public</span></h2>
                </div>

            </div>
        </div>
    </div>)
    const RequestForNameChangePlaintiffPage = () => (<div className={`break-after-page`}>
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
                    <h2 className={`uppercase`}>COUNTY: {clientData.plaintiff.county} </h2>
                    <h2>DOCKET NUMBER: ___________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName} </h2>
                <div className='bg-black text-black w-full h-[1px] '/>
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
                <li>My current married name is: {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}.
                </li>

                <li className={``}>
                    My maiden name prior to this marriage was: {clientData.plaintiff.maidenName}
                </li>
                <li className={``}>
                    With the termination of this marriage, I would like to revert to my maiden name.
                </li>
                <li>
                    Request to incorporate my name change into the Final Judgment of Divorce.
                </li>


            </ol>



            <div className='mt-8 pt-4'>


                <div className={`font-bold flex flex-col gap-4 my-8 w-full justify-start `}>
                    <div className={`flex flex-col gap- justify-start mt-`}>
                        <div className={`w-64 h-[1px] bg-black -2`}/>
                        <h2><span className={`text-`}> Signature of the Defendant</span></h2>
                    </div>
                    <div>
                        <h1>State of New New Jersey</h1>
                        <h1 className={`flex gap-2 justify-start items-end`}>County of <div
                            className={`w-24 h-[1px] bg-black`}/></h1>
                    </div>
                    <div className={`flex space-x-2 items-end justify-start`}>Signed before me on this <div
                        className={`w-8 h-[1px] bg-black`}/>of <div
                        className={`w-24 h-[1px] bg-black`}/> 20 <div className={`w-8 h-[1px] bg-black`}/></div>

                    <div className={`flex flex-col gap- justify-start mt-8`}>
                        <div className={`w-64 h-[1px] bg-black -2`}/>
                        <h2><span className={`text-`}> Signature and Seal of the Notary Public</span></h2>
                    </div>
                </div>
            </div>
        </div>
    </div>)
    const RequestForNameChangeDefendantPage = () => (<div className={`break-after-page`}>
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
            </ol>

            <div className='mt-8 pt-4'>
                <div className={`font-bold flex flex-col gap-4 my-8 w-full justify-start `}>
                    <div className={`flex flex-col gap- justify-start mt-`}>
                        <div className={`w-64 h-[1.5px] bg-black -2`}/>
                        <h2><span className={`text-`}> Signature of the Defendant</span></h2>
                    </div>
                    <div>
                        <h1>State of New New Jersey</h1>
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

            </div>
        </div>
    </div>)
    const FinalJudgementOfDivorcePage = () => (<div className={`break-after-page`}>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                    <h2>{clientData.plaintiff.mobile}</h2>

                    <div className='font-medium capitalize flex flex-col justify-between mt-6'>
                        <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
                        <div className='bg-black text-black h-[1.5px] w-[350px] '/>

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
                    <h2 className={`uppercase`}>COUNTY: {clientData.plaintiff.county}</h2>
                    <h2>DOCKET NUMBER: _______________</h2>
                    {clientData.defendant.fault}
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] '/>

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


                <p className={``}>It is on this ______ day of _____________, 20____ , <span
                    className={`font-bold uppercase`}>ORDERED AND ADJUDGED</span> and such court,
                    by virtue of the power and authority of this court and the acts of legislature in such case
                    provided.</p>

                <p className={`indent-12`}>
                    Does <span className={`font-bold uppercase`}>ORDER AND ADJUDGE</span> that the Plaintiff and the
                    Defendant be divorced from the bond of matrimony for the cause(s) aforesaid, and the marriage
                    between the parties hereby dissolved:

                    <span className={`font-bold uppercase`}>ORDERED</span>, as follows:
                </p>

                <p className={"font-bold indent-12"}>{clientData.plaintiff.maidenName || clientData.defendant.maidenName !== "" ? ` The marriage is dissolved and the ${clientData.plaintiff.maidenName == "" ? " defendant" : "plaintiff"} is permitted to use the maiden name: ${clientData.plaintiff.maidenName || clientData.defendant.maidenName}` : " The marriage is dissolved."}</p>


            </div>
            {/* Judgment Demands */}
            <div className='mt'>
                <div className={`flex flex-row gap-2 mt-12 w-full justify-between items-center `}>

                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2 className={`flex justify-between items-end`}> Date: <span
                            className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/></h2>
                    </div>
                    <div className={`flex flex-col gap-1 justify-end mt-8`}>
                        <h2 className={``}></h2>
                        <div className={`min-w-64 w-full h-[1.5px]  -mt-1 bg-black`}/>
                        <span className={`font-bold`}> J.S.C.</span>
                    </div>
                </div>

            </div>
        </div>
    </div>)
    const CertificationOfVerificationAndNonCollusionPage = () => (<div className={`break-after-page`}>
        {/* Top Section */}

        <div className='w-full flex justify-betwee items-center mt-12 mb-8'>
            <div className='font-bold w-full'>
                <h1 className='text-2xl text-center'>CERTIFICATION OF VERIFICATION AND NON-COLLUSION
                </h1>
                <h1 className='text-2xl text-center font-bold'>CERTIFICATION PURSUANT TO R5:4-2</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-8'>
            <h1 className={`my-8`}>I, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                being the Plaintiff in this matter, I certify that:</h1>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>

                <li>
                    I am the Plaintiff in the foregoing complaint.

                </li>
                <li>
                    The allegations of the complaint are true to the best of my knowledge, information, and belief.

                </li>
                <li>

                    Said complaint is made in truth and good faith and without collusion, for the causes set forth
                    therein.
                </li>
                <li>
                    To the best of my knowledge and belief, this matter in controversy is not the subject of any
                    court.
                </li>
                <li>
                    To the best of my knowledge and belief, there are no other parties who must be joined to this
                    action.

                </li>
                <li>
                    I certify that the foregoing statements made are true. I am aware that if any of the foregoing
                    statements made by me are willfully false, I am subject to punishment.

                </li>
                {/* Children Table */}

                {/* Additional paragraphs from DB or newly added */}


            </ol>


            <div className='mt-8 pt-'>
                <div className={`flex flex-row gap-2 w-full justify-between items-baseline `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2> Dated: _______________________</h2>
                    </div>
                    <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                        <div className={`w-64 h-[1.5px] bg-black`}/>
                        <h2>Plaintiff / Pro Se</h2>
                    </div>
                </div>

            </div>
        </div>
    </div>)
    const Rule5_4_2hCertificationBySelfPage = () => (<div className={`break-after-page`}>
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
                    <h2>DOCKET NUMBER : FM-{clientData.courtDecision.current.docketNumber}</h2>
                    {/*{clientData.defendant.fault}*/}
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
                <h1 className='text-2xl text-center font-bold'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center '>Rule 5:4-2(h) Certification </h1>
                <h2 className='text-2xl text-center '>by Self-Represented Litigant</h2>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-12
        '>
            <h1 className={`mb-8`}>
                I, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                of full age, hereby certify as follows:
            </h1>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>

                <li>
                    I am the <span className={`font-semibold`}> Plaintiff</span> in the above-captioned matter.
                </li>
                <li className={``}>
                    I make this Certificate pursuant to New Jersey Court Rule 5:4-2(h).
                </li>
                <li className={``}>
                    I have read the document entitled “Divorce—Dispute Resolution Alternatives to Conventional
                    Litigation.”

                </li>
                <li className={``}>
                    I thus have been informed as to the availability of complimentary dispute resolution alternatives to
                    conventional litigation.

                </li>
            </ol>
            <h1 className={`mt-12`}>
                I certify that the foregoing statements made by me are true. I am aware that if any of the foregoing
                statements made by me are willfully false, I am subject to punishment.

            </h1>

            <div className='mt-8 pt-'>
                <div className={`flex flex-row gap-2 w-full justify-between items-baseline `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2> Dated: _______________________</h2>
                    </div>
                    <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                        <div className={`w-64 h-[1.5px] bg-black`}/>
                        <h2>Plaintiff / Pro Se</h2>
                    </div>
                </div>

            </div>
        </div>
    </div>)
    const CertificationOfNonMilitaryServicePage = () => (<div className={`break-after-page`}>
        {/* Top Section */}


        <div className='w-full flex flex-col justify-between'>
            <div className=' capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col gap-0 justify-between`}>
                    <h2>{clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName}</h2>
                    <h2>{clientData.plaintiff.address1}</h2>
                    <h2>{clientData.plaintiff.address2}</h2>
                    <h2>{clientData.plaintiff.city}, {clientData.plaintiff.state}, {clientData.plaintiff.zip}</h2>
                    <h2>{clientData.plaintiff.mobile}</h2>
                    <div className='bg-black text-black w-full h-[1.5px] mt-12'/>
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
                    <h2 className={`uppercase`}>COUNTY: {clientData.courtDecision.current.county}</h2>
                    <h2>DOCKET NUMBER: _______________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1px] my-6'/>
        <div className='w-full flex justify-between items-end'>
            <div className=' capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
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

            </div>
        </div>
    </div>)
    const PlaintiffAffidavitOfNonMilitaryPage = () => (<div className={`break-after-page`}>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
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
                    <h2>DOCKET NUMBER: ______________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>NON - MILITARY</h1>
                <h2 className='capitalize text-center'>{clientData.defendant?.fault === "No Fault" ? 'Based on 18 Months Separation (No Fault)' : "based on irreconcilable differences"}</h2>

            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-4 '>
            <div>
                <h1>STATE OF NEW JERSEY</h1>
                <h1 className={`uppercase`}>COUNTY OF {clientData.plaintiff.county}</h1>
            </div>
            <p className={``}>I,
                plaintiff, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName},
                being of full age and duly sworn according to laws that support affidavits in the State of New Jersey
                depose and say:
            </p>
            <p>
                I am the plaintiff in this case and I am making this affidavit of non-military in support of my divorce.
            </p>
            <p>
                I know for my own personal knowledge that my spouse {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}, is not in the United States Military, but is living a civilian life at the following address: {clientData.defendant.address1}, {clientData.defendant.address2}, {clientData.defendant.city}, {clientData.defendant.state}, {clientData.defendant.zip}
            </p>
        </div>
        <div className='mt-8 gap-8 w-full'>
            <div className={`flex flex-row gap-2 w-full justify-between items-baseline `}>
                <div className={`flex flex-col gap-2 justify-start`}>
                    <h2> Dated: _______________________</h2>
                </div>
                <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                    <h2>Plaintiff: _______________________</h2>
                </div>
            </div>
            <div className={`flex flex-col gap-2 jus mt-8 font-semibold`}>
                <h1 className={`flex items-baseline`}>State
                    of _______________
                    {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                </h1>

                <h1 className={`flex items-baseline`}>County
                    of _____________
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

        </div>
    </div>)
    const DefendantAffidavitOfNonMilitaryPage = () => (<div className={`break-after-page`}>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
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
                    <h2>DOCKET NUMBER: ______________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>NON - MILITARY</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-8 flex flex-col space-y-4 '>
            <div>
                <h1>STATE OF NEW JERSEY</h1>
                <h1 className={`uppercase`}>COUNTY OF {clientData.plaintiff.county}</h1>
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
                I, {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}, am not in the United States Military, but I am living a civilian life at the
                following address: {clientData.defendant.address1}, {clientData.defendant.address2}, {clientData.defendant.city}, {clientData.defendant.state}, {clientData.defendant.zip}
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
                    of _______________
                    {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                </h1>

                <h1 className={`flex items-baseline`}>County
                    of _____________
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
        </div>
    </div>)
    const RequestForCertificationEnterDefaultPage = () => (<div className={`break-after-page`}>
        {/* Top Section */}
        <div className='w-full flex flex-col justify-between'>
            <div className='font-medium capitalize flex flex-row justify-between items-center'>
                <div className={`w-full flex flex-col`}>
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
                    <h2>DOCKET NUMBER: ______________</h2>
                </div>
            </div>
        </div>
        <h2 className={`indent-14`}>Vs</h2>
        <div className=' w-full h-[1.5px] my-2'/>
        <div className='w-full flex justify-between items-end'>
            <div className='font-medium capitalize flex flex-col justify-between w-[350px]'>
                <h2>{clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName}</h2>
                <h2>Defendant</h2>
                <div className='bg-black text-black w-full h-[1.5px] my-3'/>
            </div>
            <div className='font-medium'>
                <h1 className='text-xl text-center'>CIVIL ACTION</h1>
                <h1 className='text-xl text-center font-bold'>REQUEST AND CERTIFICATION TO </h1>
                <h1 className='text-xl text-center font-bold'>ENTER DEFAULT</h1>
            </div>
        </div>


        {/* Body Content */}
        <div className='mt-4 flex flex-col  '>
            <div>
                <h1>TO: </h1>
                <h1>SUPERIOR COUNTY OF NEW JERSEY</h1>
                <h1 className={`uppercase`}>COUNTY OF {clientData.plaintiff.county}</h1>
            </div>
            <p className={`indent-12 mt-2`}>You will please enter the default of the defendant for failure to plead or
                otherwise defend as provided by the rules of Civil Practice.
            </p>
        </div>

        <div className={`flex flex-row gap-2 w-full justify-between items-baseline mt-12`}>
            <div className={`flex flex-col gap-2 justify-start`}>
                <h2> Dated: _______________________</h2>
            </div>
            <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                <h2>Plaintiff, Pro Se: _______________________</h2>
            </div>
        </div>

        <div className='mt-8 flex flex-col  '>
            <div>
                <h1 className={`font-semibold`}>Of full age, hereby certifies:</h1>
            </div>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>
                <li>
                    I am the plaintiff in the above matter.

                </li>
                <li>
                    The complaint and summons in this action were served upon the defendant on _______________, ________.

                </li>
                <li>
                    The time within which the defendant may answer or otherwise move as to the complaint has expired.

                </li>
                <li>
                    The defendant, {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName} has not answered or otherwise moved.

                </li>
                <li>
                    The time for the defendant to answer has run out.

                </li>
                <li>
                    I, Plaintiff, {clientData.plaintiff.firstName} {clientData.plaintiff.middleName} {clientData.plaintiff.lastName} certify that the foregoing statements made by me are true in every manner
                    whatsoever. I am aware that if any of the foregoing statements made by me are willfully false, I am
                    subject to punishment.
                </li>

            </ol>
        </div>
        <div className={`flex flex-row gap-2 w-full justify-between items-baseline mt-12`}>
            <div className={`flex flex-col gap-2 justify-start`}>
                <h2> Dated: _______________________</h2>
            </div>
            <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                <h2>Plaintiff, Pro Se: _______________________</h2>
            </div>
        </div>
    </div>)
    const CertificationOfInternationalDomicilePage = () => (<div className={`break-after-page`}>
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
                    <h2>DOCKET NUMBER : _____________</h2>
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
                <h1 className='text-2xl text-center font-bold'>CIVIL ACTION</h1>
                <h1 className='text-2xl text-center '>Certification of International Domicile</h1>
            </div>
        </div>

        {/* Body Content */}
        <div className='mt-6
        '>
            <div>
                <h1>STATE OF NEW JERSEY</h1>
                <h1 className={`uppercase`}>COUNTY OF {clientData.plaintiff.county}</h1>
            </div>
            <h1 className={`mb-8`}>
                I, {clientData.defendant.firstName} {clientData.defendant.middleName} {clientData.defendant.lastName},
                of full age, hereby certify:
            </h1>
            <ol className='list-inside list-decimal flex flex-col space-y-4'>

                <li>
                    I am the <span className={`font-semibold`}> Defendant</span> in the foregoing action for divorce.
                </li>
                <li className={``}>
                    I am domiciled in {clientData.defendant.city}, {clientData.defendant.state}
                </li>
                <li className={``}>
                    My full address is:
                    <p className={`indent-8 font-semibold`}> {clientData.defendant.address1},</p>
                    <p className={`indent-8 font-semibold`}>  {clientData.defendant.address2},</p>
                    <p className={`indent-8 font-semibold`}> {clientData.defendant.city},</p>
                    <p className={`indent-8 font-semibold`}> {clientData.defendant.state},</p>
                    <p className={`indent-8 font-semibold`}>  {clientData.defendant.zip}.</p>

                </li>

            </ol>

            <div className='mt-8 pt-'>
                <div className={`flex font-semibold flex-row gap-2 w-full justify-between items-baseline `}>
                    <div className={`flex flex-col gap-2 justify-start`}>
                        <h2> Date: _______________________</h2>
                    </div>
                    <div className={`flex flex-col gap-2 justify-end items-baseline`}>
                        <div className={`w-64 h-[1.5px] bg-black`}/>
                        <h2>(Defendant Signature)Defendant, Pro Se</h2>
                    </div>
                </div>
                <div className={`flex flex-col gap-2 jus mt-4 font-normal`}>
                    <h1 className={`flex items-baseline`}>State
                        of {clientData.defendant.state}
                        {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                    </h1>

                    <h1 className={`flex items-baseline`}>County of
                        of {clientData.courtDecision.current.county}
                        {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}*/}
                    </h1>
                </div>
                <div className={`flex flex-col mt-20 w-full justify-between items-start gap-1`}>
                    <div className={` w-80 h-[1.5px] bg-black`}/>

                    <h2> Signature of the Notary Public</h2>

                </div>

            </div>
        </div>
    </div>)
    const CertificationOfInsurancePage = () => (<div className={`break-after-page`}>
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
    </div>)

    // ─── Map keys to either our inline or imported pages ────────────
    const componentMap = {
        civilActionComplaintForDivorce: civilActionComplaintForDivorce,
        acknowledgementOfServices: AcknowledgementOfServices,
        requestForNonAppearanceJudgementForDivorce: RequestForNonAppearanceJudgementForDivorcePage,
        martialSettlementAgreement: MartialSettlementAgreementPage,
        military: MilitaryPage,
        requestForNameChangePlaintiff: RequestForNameChangePlaintiffPage,
        requestForNameChangeDefendant: RequestForNameChangeDefendantPage,
        finalJudgementOfDivorce: FinalJudgementOfDivorcePage,
        certificationOfVerificationAndNonCollusion: CertificationOfVerificationAndNonCollusionPage,
        'rule5:4_2(h)CertificationBySelf_RepresentedLitigant': Rule5_4_2hCertificationBySelfPage,
        certificationOfNonMilitaryService: CertificationOfNonMilitaryServicePage,
        plaintiffAffidavitOfNon_Military: PlaintiffAffidavitOfNonMilitaryPage,
        defendantAffidavitOfNon_Military: DefendantAffidavitOfNonMilitaryPage,
        requestForCertification_EnterDefault: RequestForCertificationEnterDefaultPage,
        certificationOfInternationalDomicile: CertificationOfInternationalDomicilePage,
        certificationOfInsurance: CertificationOfInsurancePage,
    }

    // ─── Render only the selected docs, each forced to break a page ───
    return (<div className="p-4 text-sm flex flex-col min-w-screen min-h-screen font-sans w-full h-screen">
        {docs.map((key, index) => {
            const Doc = componentMap[key]
            console.log(key)
            return Doc ? (<div key={index} className="break-after-page">
                <Doc/>
            </div>) : null
        })}
    </div>)
}