'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import useMousePosition from '@/utils/cursor'
import { Button } from '@/components/ui/button'

const documents = [
    { key: 'civilActionComplaintForDivorce', label: 'Complaint For Divorce' },
    { key: 'acknowledgementOfServices', label: 'Acknowledgement Of Services' },
    { key: 'requestForNonAppearanceJudgementForDivorce', label: 'Request for Non-Appearance Judgement For Divorce' },
    { key: 'martialSettlementAgreement', label: 'Martial Settlement Agreement' },
    { key: 'military', label: 'Military' },
    { key: 'requestForNameChangePlaintiff', label: 'Plaintiff – Request For Name Change' },
    { key: 'requestForNameChangeDefendant', label: 'Defendant – Request For Name Change' },
    { key: 'finalJudgementOfDivorce', label: 'Final Judgement Of Divorce' },
    { key: 'certificationOfVerificationAndNonCollusion', label: 'Certification Of Verification And Non-Collusion' },
    { key: 'rule5:4_2(h)CertificationBySelf_RepresentedLitigant', label: 'Rule 5:4-2(h) Certification by Self-Represented Litigant' },
    { key: 'certificationOfNonMilitaryService', label: 'Certification of Non-Military Service' },
    { key: 'plaintiffAffidavitOfNon_Military', label: 'Plaintiff Affidavit Of Non-Military' },
    { key: 'defendantAffidavitOfNon_Military', label: "Defendant's Affidavit of Non-Military" },
    { key: 'requestForCertification_EnterDefault', label: 'Request And Certification To Enter Default' },
    { key: 'certificationOfInternationalDomicile', label: 'Certification Of International Domicile' },
    { key: 'certificationOfInsurance', label: 'Certification Of Insurance' },
    { key: 'sample', label: 'Sample' },
]

export default function Page() {
    const router = useRouter()
    const segments = usePathname().split('/')
    const id = segments[segments.length - 1]
    const { x, y } = useMousePosition()

    const [clientData, setClientData] = useState(null)
    const [selected, setSelected] = useState([])

    useEffect(() => {
        if (!id) return
        fetch(`/api/getClientById/${id}`)
            .then(res => res.json())
            .then(data => setClientData(data))
            .catch(console.error)
    }, [id])

    function toggle(key) {
        setSelected(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        )
    }

    function handlePrintSelected() {
        const qs = selected.join(',')
        router.push(`/application/document_templates/${id}/print-selected?docs=${qs}`)
    }

    if (!clientData) return null

    return (
        <div className="relative overflow-x-hidden overflow-y-auto bg-fixed bg-cover bg-center h-full flex flex-col items-center justify-center bg-[url('/Wall2.jpg')] bg-white/20 min-h-screen">
            <div className="w-[90%] max-w-[1600px] flex flex-col overflow-y-scroll items-center p-8 rounded-3xl max-h-[90vh] min-h-[90vh] shadow-2xl bg-white/10 backdrop-blur-md">
                {/* header */}
                <div className="flex justify-between w-full">
                    <Link href="/application/dashboard" className="text-xl md:text-4xl font-semibold">
                        Tri State Community Services
                    </Link>
                    <Link href="/application/dashboard" className="text-sm md:text-base font-semibold">
                        <Button>Dashboard</Button>
                    </Link>
                </div>

                {/* client info */}
                <div className="mt-24 flex flex-col md:flex-row justify-center items-center w-full">
                    <div className="w-full">
                        <h1>
                            <span className="font-bold">Plaintiff:</span> {clientData.plaintiff.firstName}
                        </h1>
                        <h2>
                            <span className="font-bold">Defendant:</span> {clientData.defendant.firstName}
                        </h2>
                        <h1>
                            <span className="font-bold">City:</span> {clientData.plaintiff.city}
                        </h1>
                        <h1>
                            <span className="font-bold">Mobile:</span> {clientData.plaintiff.mobile}
                        </h1>
                        <h6 className="mt-12 text-sm opacity-55">
                            Please select the documents you want to print.
                        </h6>
                    </div>

                    {/* document list */}
                    <div className="w-full max-h-[60vh] h-full overflow-y-auto text-sm gap-4 flex flex-col">
                        {documents.map(doc => (
                            <div
                                key={doc.key}
                                className="flex justify-between items-center group overflow-hidden px-6 py-3 min-h-12 bg-black rounded-lg text-white text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(doc.key)}
                                        onChange={() => toggle(doc.key)}
                                        className="accent-white"
                                    />
                                    <span>{doc.label}</span>
                                </div>
                                <Link
                                    href={`/application/document_templates/${id}/${doc.key}`}
                                    className="flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="hidden size-4 transition-all duration-100 group-hover:flex"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* print selected button */}
                {selected.length > 0 && (
                    <div className="mt-6 print:hidden">
                        <Button variant="outline" onClick={handlePrintSelected}>
                            Print Selected ({selected.length})
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}