'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Page = () => {
  const pathname = usePathname().split('/')
  const id = pathname[pathname.length - 1]
  return (
    <div className=' flex flex-col min-w-screen min-h-screen w-full h-screen justify-center items-center'>
      {id}
      <Button className="max-w-fit">
        <Link
          href={`/document_templates/${id}/civil-action-complaint-for-divorce`}
        >
          {' '}
          civil-action-complaint-for-divorce
        </Link>
      </Button>
    </div>
  )
}

export default Page
