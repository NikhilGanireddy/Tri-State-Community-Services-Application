'use client'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const Page = () => {
    const pathname = usePathname().split('/')
    const id = pathname[pathname.length - 1]
    return (<div className=' flex flex-col gap-8 min-h-screen w-full h-screen justify-center items-center'>
            User id : {id}
            <title>Documents</title>
            <Button className=''>
                <Link href={`/document_templates/${id}/civilActionComplaintForDivorce`}>
                    {' '}
                    Civil Action Complaint For Divorce
                </Link>

            </Button>
            <Button className=''>
                <Link href={`/document_templates/${id}/acknowledgementOfServices`}>
                    {' '}
                    Acknowledgement Of Services
                </Link>

            </Button>

        </div>)
}

export default Page
