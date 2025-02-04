import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
export const metadata = {
  title: 'Dashboard | Tri State Community Services',
};

const Page = () => {
  return (
    <div
      className={`flex flex-col gap-4 min-h-full justify-between w-screen space-x-4 items-center h-full`}
    >
      <Link href={'/'} className={`text-2xl font-semibold`}>
        Tri State Community Services
      </Link>
      <h1> Dashboard</h1>
      <div className='flex w-full justify-center gap-8  items-center'>
        <Button>
          <Link href='/intake-sheet'>Intake-sheet</Link>
        </Button>
        <Button>
          <Link href='/clients'>Clients</Link>
        </Button>
      </div>
    </div>
  )
}

export default Page
