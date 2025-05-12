'use client'
import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {format, getDate, getMonth, getYear} from 'date-fns'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Button} from "@/components/ui/button";

const ComplaintForDivorcePage = () => {
    const segments = usePathname().split('/')
    const id = segments[segments.length - 2]

    const [clientData, setClientData] = useState(null)

    useEffect(() => {
        if (!id) return
        fetch(`/api/getClientById/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setClientData(data)
                if (data.plaintiff?.firstName && data.defendant?.firstName) {
                    document.title = `${data.plaintiff.firstName} ${data.plaintiff.lastName}  Vs ${data.defendant.firstName} ${data.defendant.lastName}`
                }
            })
            .catch(console.error)
    }, [id])

    if (!clientData) return null

    return (<div className="p-4 text-sm flex flex-col min-w-screen min-h-screen w-full h-screen font-sans">
        <div className={`break-after-page`}>
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
                        The Plaintiff, {clientData.plaintiff.firstName}{' '}
                        {clientData.plaintiff.middleName}{' '}
                        {clientData.plaintiff.lastName}, resides at{' '}
                        {clientData.plaintiff.address1}, in the City of{' '}
                        {clientData.plaintiff.city} and the State of{' '}
                        {clientData.plaintiff.state} by way of complaint against the
                        defendant, says:
                    </li>
                    <li>
                        Plaintiff was lawfully married to{' '}
                        {clientData.defendant.firstName}{' '}
                        {clientData.defendant.middleName}{' '}
                        {clientData.defendant.lastName}, the defendant herein, in a civil
                        ceremony on{' '}
                        {format(new Date(clientData.marriage.dateOfMarriage), 'PPP')} in{' '}
                        {clientData.marriage.cityOfMarriage},{' '}
                        {clientData.marriage.stateOfMarriage}.
                    </li>
                    <li>
                        {clientData.defendant.fault === 'No Fault' ? `The parties separated on or about ${format(new Date(clientData.marriage.dateOfSeparation), 'PPP')}. Ever since for more than 18 consecutive months, the parties
                have lived separately with no reasonable prospect of
                reconciliation.` : `For more than one year before the filing of this complaint, the plaintiff has been a bona fide resident of the State of New Jersey and the County of ${clientData.plaintiff.county}.`}
                    </li>
                    <li>
                        {clientData.defendant.fault === 'No Fault' ? `At the expiration of the 18-month separation, plaintiff resided at ${clientData.plaintiff.address1}, ${clientData.plaintiff.address2}, ${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip}, when the cause of action arose.` : `Plaintiff and defendant have experienced irreconcilable differences for six months or more, causing the breakdown of the marriage.`}
                    </li>
                    <li>
                        There are{' '}
                        {clientData.children.count > 0 ? clientData.children.count : 'no'}{' '}
                        children born of the marriage.
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
        </div>
        <div className={`break-after-page`}>
                {/* Top Section */}
                <div className="w-full flex flex-col justify-between mb-6">
                    <div className="font-medium capitalize flex justify-between items-center">
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
                            <div className="bg-black h-[1.5px] my-3" />
                            <h2>
                                {clientData.plaintiff.firstName}{' '}
                                {clientData.plaintiff.middleName}{' '}
                                {clientData.plaintiff.lastName}
                            </h2>
                            <h2>Plaintiff</h2>
                        </div>
                        <div className="w-full" />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div />
                        <div className="font-medium capitalize">
                            <h2>SUPERIOR COURT OF NEW JERSEY</h2>
                            <h2>CHANCERY DIVISION-FAMILY PART</h2>
                            <h2 className="uppercase">
                                COUNTY: {clientData.plaintiff.county}
                            </h2>
                            <h2>DOCKET NUMBER: _____________</h2>
                        </div>
                    </div>
                </div>

                <h2 className="indent-14">Vs</h2>
                <div className="w-full h-[1.5px] my-6" />

                <div className="flex justify-between items-end mb-8">
                    <div className="font-medium capitalize flex flex-col w-[350px]">
                        <h2>
                            {clientData.defendant.firstName}{' '}
                            {clientData.defendant.middleName}{' '}
                            {clientData.defendant.lastName}
                        </h2>
                        <h2>Defendant</h2>
                        <div className="bg-black h-[1.5px] my-3" />
                    </div>
                    <div className="font-medium text-center">
                        <h1 className="text-2xl">CIVIL ACTION</h1>
                        <h1 className="text-2xl font-bold">ACKNOWLEDGMENT OF SERVICES</h1>
                        <h1 className="text-2xl font-bold">
                            SUMMONS AND COMPLAINTS BY THE DEFENDANT AND WAIVER
                        </h1>
                        <h2 className="capitalize mt-2">
                            {clientData.defendant.fault === 'No Fault'
                                ? 'Based on 18 Months Separation'
                                : 'based on irreconcilable differences'}
                        </h2>
                        <h2 className="mt-1">
                            {clientData.defendant.fault === 'No Fault' ? '(No Fault)' : 'Pro/Se'}
                        </h2>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-col space-y-8">
                    <div>
                        <p className="indent-12">
                            The undersigned hereby acknowledges service of a copy of the summons
                            and complaint.
                        </p>
                        <p className="mt-2">
                            I, the defendant, waive my 35 days to answer the complaint.
                        </p>
                    </div>

                    <div className="mt-8">
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
                            <h2> State of New Jersey &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>
                            <h2> County of  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`}`}</h2>

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
        </div>
        <div className={`break-after-page`}>
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
                    {/* Print Button (delayed by 2s, disabled while waiting) */}
                    
                </div>
            </div>
        </div>

    </div>)
}

export default ComplaintForDivorcePage