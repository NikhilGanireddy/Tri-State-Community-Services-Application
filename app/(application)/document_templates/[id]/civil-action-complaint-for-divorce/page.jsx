'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { getDate, getMonth, getYear } from 'date-fns'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'


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
      placeOfBirth: ''
    },
    marriage: {
      dateOfMarriage: null,
      cityOfMarriage: '',
      stateOfMarriage: '',
      dateOfSeparation: null
    },
    children: {
      count: 1,
      details: [
        {
          id: '0',
          name: '',
          dob: null,
          placeOfBirth: '',
          ssn: '',
          sex: ''
        }
      ]
    },
    custody: {
      physicalCustody: '',
      legalCustody: '',
      visitationLimitation: '',
      childSupport: '',
      supportAmount: '',
      supportFrequency: ''
    },
    courtDecision: {
      previous: {
        docketNumber: '',
        caseName: '',
        county: ''
      },
      current: {
        docketNumber: '',
        caseName: '',
        county: ''
      }
    },
    realEstateDetails: {
      properties: [
        { description: '', equity: '' },
        { description: '', equity: '' },
        { description: '', equity: '' }
      ],
      personalProperty: {
        defendant: '',
        plaintiff: ''
      }
    },
    insurance: {
      hasInsurance: false,
      details: {
        life: { company: '', policy: '' },
        auto: { company: '', policy: '' },
        health: {
          company: '',
          policy: '',
          group: '',
          throughEmployment: false
        },
        homeowners: { company: '', policy: '' }
      }
    },
    licenses: {
      driversLicense: {
        number: '',
        stateOfIssue: ''
      },
      employerDetails: {
        name: '',
        contact: '',
        address: ''
      },
      professionalLicense: {
        details: ''
      }
    },
    biographicDetails: {
      gender: '',
      race: '',
      height: '',
      weight: '',
      eyeColor: '',
      hairColor: ''
    },
    referralSource: {
      media: '',
      nameOfMedia: ''
    },
    sheriffAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      notes: ''
    },
    serviceFee: '' // New field for service fee
  })

  const [textBoxes, setTextBoxes] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const addTextBox = () => {
    setTextBoxes([...textBoxes, { id: Date.now(), title: '', details: '' }])
  }

  const handleChange = (id, field, value) => {
    setTextBoxes(prev =>
      prev.map(box => (box.id === id ? { ...box, [field]: value } : box))
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const [extraData, setExtraData] = useState("civil-action-complaint-for-divorce");

  const downloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures Clerk authentication is passed
        body: JSON.stringify({ id, extraData }), // Send data to backend
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "page.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  useEffect(() => {
    if (!id) return // Wait for the ID to be available

    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/getClientById/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch client data')
        }
        const data = await response.json()
        setClientData(data) // Populate state with fetched data
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchClientData()
  }, [id])

  return (
    <div
      className=' p-4 flex flex-col min-w-screen min-h-screen w-full h-screen'
    >
      <div className='w-full flex flex-row items-center justify-between'>
        <div className='font-medium capitalize'>
          <h2>{`${clientData.plaintiff.firstName} ${clientData.plaintiff.lastName}`}</h2>
          <h2>{`${clientData.plaintiff.address1}`}</h2>
          <h2>{`${clientData.plaintiff.address2}`}</h2>
          <h2>{`${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip}`}</h2>
          <h2>+1{`${clientData.plaintiff.mobile}`}</h2>
        </div>
        <div className='font-medium capitalize'>
          <h2> SUPERIOR COURT OF NEW JERSEY</h2>
          <h2>CHANCERY DIVISION-FAMILY PART</h2>
          <h2> COUNTY</h2>
          <h2> DOCKET NUMBER NONE</h2>
        </div>
      </div>
      <div className='bg-black text-black w-full h-[1px] my-3' />
      <div className='w-full flex justify-between items-center '>
        <div className='font-medium w- capitalize flex justify-between items-center space-x-4'>
          <div>
            <h2>{`${clientData.plaintiff.firstName} ${clientData.plaintiff.lastName}`}</h2>
            <h2>Plaintiff</h2>
          </div>
          <div>
            {' '}
            <h2>Vs</h2>
          </div>
          <div>
            <h2>{`${clientData.defendant.firstName} ${clientData.defendant.lastName}`}</h2>
            <h2>Defendant</h2>
          </div>
        </div>
        <div className='font-medium'>
          <h1 className='text-2xl text-center'>CIVIL ACTION </h1>
          <h1 className='text-2xl  text-center font-bold'>
            COMPLAINT FOR DIVORCE
          </h1>
          <h2 className='capitalize'>based on irreconcilable differences</h2>
          <h2>Pro/Se</h2>
        </div>
      </div>
      <div className='mt-8'>
        <ol className='list-inside list-decimal flex flex-col space-y-4'>
          <li>
            The Plaintiff,{' '}
            {`${clientData.plaintiff.firstName} ${clientData.plaintiff.lastName}`}
            , resides at {`${clientData.plaintiff.address1}`}, in the City of
            {` ${clientData.plaintiff.county} county`} of{' '}
            {`${clientData.plaintiff.city}`} and the State of{' '}
            {`${clientData.plaintiff.state}`}, by way of complaint against
            defendant, says:
          </li>
          <li>
            Plaintiff was lawfully married to{' '}
            {`${clientData.defendant.firstName} ${clientData.defendant.lastName}`}
            , the defendant herein, in a civil ceremony on{' '}
            {clientData.marriage.dateOfMarriage} in the City of{' '}
            {`${clientData.marriage.cityOfMarriage} ${clientData.marriage.stateOfMarriage}`}
            .
          </li>
          <li>
            The parties separated on or about , Ever since the time and for more
            than 18 consecutive months, the parties have lived separately and
            apart and in different locations. The separation has continued to
            the present time and there is no reasonable prospect of
            reconciliation.
          </li>
          <li>
            At the point at which plaintiff and defendant had lived separately
            for 18 months, Plaintiff was a bona fide resident of the State of
            New Jersey, county of Morris and has ever since and for more than
            one year next proceeding the commencement of this action, continued
            to be such a bona fide resident.
          </li>
          <li>
            The defendant, Diana V Parra-Posada, resides at 1100 Parsippany
            Boulevard, Apt 189 Parsippany, NJ 07054.
          </li>
          <li>
            At the expiration of the 18-month separation, plaintiff resided at ,
            144 Kingston Road, Parsippany, NJ 07054, County of Morris and the
            state of New Jersey, and was a resident of Morris COUNTY and the
            state of New Jersey when the cause of action arose.
          </li>
          <li>
            There are{' '}
            {clientData.children.count != 0
              ? `${clientData.children.count}`
              : 'no'}{' '}
            children born of marriage:
            {clientData.children.count != 0 ? (
              <Table>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[100px]'>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className='text-right'>Properties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.children.details.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className='font-medium'>
                          {user.name}
                        </TableCell>
                        <TableCell>{user.placeOfBirth}</TableCell>
                        <TableCell>{`${getMonth(user.dob) + 1}-${getDate(
                          user.dob
                        )}-${getYear(user.dob)}`}</TableCell>
                        <TableCell className='text-right flex gap-2 justify-end items-center'>
                          {user.sex}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Table>
            ) : (
              'no'
            )}
          </li>

          {!submitted ? (
            <>
              <Button className='w-max' onClick={addTextBox}>
                Add Textbox
              </Button>
              <div className='w-full max-w-lg space-y-4'>
                {textBoxes.map(box => (
                  <div key={box.id} className='border p-4 rounded-lg shadow'>
                    <div className='space-y-2'>
                      <Label>Title</Label>
                      <Input
                        type='text'
                        placeholder='Enter title'
                        value={box.title}
                        onChange={e =>
                          handleChange(box.id, 'title', e.target.value)
                        }
                      />
                    </div>
                    <div className='space-y-2 mt-2'>
                      <Label>Details</Label>
                      <Textarea
                        type='text'
                        placeholder='Enter details'
                        value={box.details}
                        onChange={e =>
                          handleChange(box.id, 'details', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              {textBoxes.length > 0 && (
                <Button className='w-max' onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </>
          ) : (
            <div className='w-full space-y-4'>
              {textBoxes.map((box, index) => (
                <li key={box.id} className=''>
                  <strong>{box.title}</strong>: {box.details}
                </li>
              ))}
            </div>
          )}
        </ol>
      </div>
      <Button onClick={downloadPDF} className='mt-4'>
        Download PDF
      </Button>
    </div>
  )
}

export default Page
