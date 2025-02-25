'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const pathname = usePathname().split('/')
  const id = pathname[pathname.length - 2]
  console.log(id)

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
    <div className=' flex text-sm flex-col min-w-screen min-h-screen w-full h-screen'>
      <div className='w-full flex flex-row items-center justify-between'>
        <div>
          <h2>{`${clientData.plaintiff.firstName} ${clientData.plaintiff.lastName}`}</h2>
          <h2>{`${clientData.plaintiff.address1}`}</h2>
          <h2>{`${clientData.plaintiff.address2}`}</h2>
          <h2>{`${clientData.plaintiff.city}, ${clientData.plaintiff.state}, ${clientData.plaintiff.zip}`}</h2>
          <h2>{`${clientData.plaintiff.mobile}`}</h2>
        </div>
        <div>
          <h2> SUPERIOR COURT OF NEW JERSEY</h2>
          <h2>CHANCERY DIVISION-FAMILY PART</h2>
          <h2> COUNTY</h2>
          <h2> DOCKET NUMBER NONE</h2>
        </div>
      </div>
      <div className='bg-black text-black w-full h-[0.5px]' />
      <div className='w-full flex flex-row items-center justify-between'>
        <div>
          <h2>{`${clientData.plaintiff.firstName} ${clientData.plaintiff.lastName}`}</h2>
          <h2>Plaintiff</h2>
          <h2>{" "}</h2>
          <h2>{" "}</h2>
          <h2>Vs</h2>
          <h2>{" "}</h2>
          <h2>{" "}</h2>
          <h2>{`${clientData.defendant.firstName} ${clientData.defendant.lastName}`}</h2>
          <h2>Defendant</h2>
        </div>
        <div>
          <h1>CIVIL ACTION </h1>
          <h1>COMPLAINT FOR DIVORCE</h1>
          <h2>BASED ON IRRECONCILABLE DIFFERENCES</h2>
          <h2>Pro/Se</h2>
        </div>
      </div>
    </div>
  )
}

export default Page
