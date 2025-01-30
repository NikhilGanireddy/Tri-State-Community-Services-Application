"use client"
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { connectToDB } from '@/lib/mongoose'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


const Page = () => {

  const [clientDaata, setClientDaata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

    const pathname = usePathname().split("/")
    const id = pathname[pathname.length-1]
    // console.log(clientId)

    const [user, setUser] = useState(null);
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

  const onPageLoad = async () => {
    try {
      const response = await fetch('/api/editClientData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientId), // Send clientData to the backend
      });

      if (response.ok) {
        setClientData(response.body)
        alert('Client data fetched successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving client data:', error);
      alert('Error saving client data.');
    }
  };
  

// onPageLoad()
  const handleFieldChange = (category, field, value) => {
    setClientData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleChildFieldChange = (index, field, value) => {
    setClientData(prev => {
      const updatedChildren = [...prev.children.details]
      updatedChildren[index] = { ...updatedChildren[index], [field]: value }
      return {
        ...prev,
        children: { ...prev.children, details: updatedChildren }
      }
    })
  }

  const handleChildrenCountChange = count => {
    setClientData(prev => {
      const updatedChildren = [...prev.children.details]
      const currentCount = updatedChildren.length

      if (count > currentCount) {
        const newChildren = Array.from(
          { length: count - currentCount },
          (_, i) => ({
            id: `${currentCount + i}`,
            name: '',
            dob: null,
            placeOfBirth: '',
            ssn: '',
            sex: ''
          })
        )
        return {
          ...prev,
          children: { count, details: [...updatedChildren, ...newChildren] }
        }
      } else if (count < currentCount) {
        return {
          ...prev,
          children: { count, details: updatedChildren.slice(0, count) }
        }
      }
      return prev
    })
  }
  const handlePlaintiffChange = (field, value) => {
    setClientData(prev => ({
      ...prev,
      plaintiff: {
        ...prev.plaintiff,
        [field]: value
      }
    }))
  }

  const handleDefendantChange = (field, value) => {
    setClientData(prev => ({
      ...prev,
      defendant: {
        ...prev.defendant,
        [field]: value
      }
    }))
  }
  const handleRealEstateChange = (index, field, value) => {
    setClientData(prev => {
      const updatedProperties = [...prev.realEstateDetails.properties]
      updatedProperties[index][field] = value
      return {
        ...prev,
        realEstateDetails: {
          ...prev.realEstateDetails,
          properties: updatedProperties
        }
      }
    })
  }

  const handlePersonalPropertyChange = (field, value) => {
    setClientData(prev => ({
      ...prev,
      realEstateDetails: {
        ...prev.realEstateDetails,
        personalProperty: {
          ...prev.realEstateDetails.personalProperty,
          [field]: value
        }
      }
    }))
  }

  const handleInsuranceChange = (type, field, value) => {
    setClientData(prev => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        details: {
          ...prev.insurance.details,
          [type]: {
            ...prev.insurance.details[type],
            [field]: value
          }
        }
      }
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/saveClientData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData), // Send clientData to the backend
      });

      if (response.ok) {
        alert('Client data saved successfully!');
        // router.push(`${}`)
        
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving client data:', error);
      alert('Error saving client data.');
    }
  };

  const handleSaveChildrenData = () => {
    // Your logic to save or process the data goes here
    // Example: you could send clientData to an API or local storage
  }
  const [date, setDate] = React.useState()
  const [childrenCount, setChildrenCount] = useState(1)

  const [childrenData, setChildrenData] = useState([
    {
      id: '0',
      name: '',
      dob: null,
      placeOfBirth: '',
      ssn: '',
      sex: ''
    }
  ])


  useEffect(() => {
    setChildrenData(prev => {
      if (prev.length === childrenCount) return prev
      if (prev.length < childrenCount) {
        const itemsToAdd = childrenCount - prev.length
        const newItems = Array.from({ length: itemsToAdd }, (_, idx) => ({
          id: String(prev.length + idx),
          name: '',
          dob: null,
          placeOfBirth: '',
          ssn: '',
          sex: ''
        }))
        return [...prev, ...newItems]
      }
      return prev.slice(0, childrenCount)
    })
  }, [childrenCount])

  const renderChildrenInputs = () => {
    return childrenData.map((child, i) => (
      <TableRow key={child.id}>
        <TableCell className='text-center'>{i + 1}</TableCell>
        <TableCell>
          <Input
            type='text'
            placeholder={`Child ${i + 1} Name`}
            value={child.name}
            onChange={e => handleChildFieldChange(i, 'name', e.target.value)}
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !child.dob && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {child.dob ? format(child.dob, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={child.dob}
                onSelect={date => handleChildDateChange(i, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>
          <Input
            type='text'
            placeholder='Place of Birth'
            value={child.placeOfBirth}
            onChange={e =>
              handleChildFieldChange(i, 'placeOfBirth', e.target.value)
            }
          />
        </TableCell>
        <TableCell>
          <Input
            type='text'
            placeholder='SSN'
            value={child.ssn}
            onChange={e => handleChildFieldChange(i, 'ssn', e.target.value)}
          />
        </TableCell>
        <TableCell>
          <Input
            type='text'
            placeholder='Sex'
            value={child.sex}
            onChange={e => handleChildFieldChange(i, 'sex', e.target.value)}
          />
        </TableCell>
      </TableRow>
    ))
  }
  useEffect(() => {
    if (!id) return; // Wait for the ID to be available

    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/getClientById/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client data');
        }
        const data = await response.json();
        setClientData(data); // Populate state with fetched data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  
  return (
    <div className={` max-w-[1200px] mx-auto rounded-2xl py-12 px-4`}>
      <Link href={"/"} className={`text-2xl font-semibold`}>Tri State Community Services</Link>
      <h2 className={`text-xl`}>Intake Sheet</h2>

      <div>
        <Separator className={`my-4`} />
        <div>
          <Tabs
            defaultValue='Plaintiff'
            className='w-full h-full flex flex-col md:flex-row  gap-4 p-4'
          >
            <TabsList className='bg-transparent flex flex-row md:flex-col w-full md:w-1/4 h-full px-0 md:px-1 justify-start items-start overflow-x-scroll'>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Plaintiff'
              >
                Plaintiff
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Defendant'
              >
                Defendant
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Marriage'
              >
                Marriage
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Children'
              >
                Children
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Custody'
              >
                Custody
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='CourtDecision'
              >
                Court Decision
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='RealEstateDetails'
              >
                Real Estate Details
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='Insurance'
              >
                Insurance
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='License'
              >
                License
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='BiographicDetails'
              >
                Biographic Details
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='SheriffAddress'
              >
                Sheriff Address
              </TabsTrigger>
              <TabsTrigger
                className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                value='ServiceFee'
              >
                Service Fee
              </TabsTrigger>
            </TabsList>
            <TabsContent className={`w-full md:w-3/4`} value='Plaintiff'>
              <Card>
                <CardHeader>
                  <CardTitle>Plaintiff</CardTitle>
                  <CardDescription>
                    Enter the Plaintiff details of the client
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='fName'>First Name</Label>
                    <Input
                      id='fName'
                      value={clientData.plaintiff.firstName}
                      placeholder='First Name'
                      onChange={e =>
                        handlePlaintiffChange('firstName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='mName'>Middle Name</Label>
                    <Input
                      id='mName'
                      value={clientData.plaintiff.middleName}
                      placeholder='Middle Name'
                      onChange={e =>
                        handlePlaintiffChange('middleName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='lName'>Last Name</Label>
                    <Input
                      id='lName'
                      value={clientData.plaintiff.lastName}
                      placeholder='Last Name'
                      onChange={e =>
                        handlePlaintiffChange('lastName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='maidenName'>Maiden Name</Label>
                    <Input
                      id='maidenName'
                      value={clientData.plaintiff.maidenName}
                      placeholder='Maiden Name'
                      onChange={e =>
                        handlePlaintiffChange('maidenName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <div className='space-y-3'>
                      <Label>Address</Label>
                      <Input
                        id='address1'
                        value={clientData.plaintiff.address1}
                        placeholder='Address line 1'
                        onChange={e =>
                          handlePlaintiffChange('address1', e.target.value)
                        }
                      />
                      <Input
                        id='address2'
                        value={clientData.plaintiff.address2}
                        placeholder='Address line 2'
                        onChange={e =>
                          handlePlaintiffChange('address2', e.target.value)
                        }
                      />
                      <div className='flex w-full items-center justify-between gap-3'>
                        <Input
                          id='city'
                          value={clientData.plaintiff.city}
                          placeholder='City'
                          onChange={e =>
                            handlePlaintiffChange('city', e.target.value)
                          }
                        />
                        <Input
                          id='zip'
                          value={clientData.plaintiff.zip}
                          placeholder='Zip'
                          onChange={e =>
                            handlePlaintiffChange('zip', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !clientData.plaintiff.dob && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon />
                          {clientData.plaintiff.dob
                            ? format(clientData.plaintiff.dob, 'PPP')
                            : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={clientData.plaintiff.dob}
                          onSelect={date => handlePlaintiffChange('dob', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='space-y-1'>
                    <Label>Place of Birth</Label>
                    <Input
                      id='placeOfBirth'
                      value={clientData.plaintiff.placeOfBirth}
                      placeholder='Place of Birth'
                      onChange={e =>
                        handlePlaintiffChange('placeOfBirth', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label>Mobile</Label>
                    <Input
                      id='mobile'
                      value={clientData.plaintiff.mobile}
                      placeholder='Mobile'
                      onChange={e =>
                        handlePlaintiffChange('mobile', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Checkbox
                      checked={clientData.plaintiff.inNewJersey}
                      onCheckedChange={checked =>
                        handlePlaintiffChange('inNewJersey', checked)
                      }
                    >
                      Resides in New Jersey
                    </Checkbox>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className={`w-full md:w-3/4`} value='Defendant'>
              <Card>
                <CardHeader>
                  <CardTitle>Defendant</CardTitle>
                  <CardDescription>
                    Enter the Defendant details of the client
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='space-y-1'>
                    <Label htmlFor='defendantFirstName'>First Name</Label>
                    <Input
                      id='defendantFirstName'
                      value={clientData.defendant.firstName}
                      placeholder='First Name'
                      onChange={e =>
                        handleDefendantChange('firstName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='defendantMiddleName'>Middle Name</Label>
                    <Input
                      id='defendantMiddleName'
                      value={clientData.defendant.middleName}
                      placeholder='Middle Name'
                      onChange={e =>
                        handleDefendantChange('middleName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='defendantLastName'>Last Name</Label>
                    <Input
                      id='defendantLastName'
                      value={clientData.defendant.lastName}
                      placeholder='Last Name'
                      onChange={e =>
                        handleDefendantChange('lastName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='defendantMaidenName'>Maiden Name</Label>
                    <Input
                      id='defendantMaidenName'
                      value={clientData.defendant.maidenName}
                      placeholder='Maiden Name'
                      onChange={e =>
                        handleDefendantChange('maidenName', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label>Address</Label>
                    <Input
                      id='defendantAddress1'
                      value={clientData.defendant.address1}
                      placeholder='Address line 1'
                      onChange={e =>
                        handleDefendantChange('address1', e.target.value)
                      }
                    />
                    <Input
                      id='defendantAddress2'
                      value={clientData.defendant.address2}
                      placeholder='Address line 2'
                      onChange={e =>
                        handleDefendantChange('address2', e.target.value)
                      }
                    />
                    <div className='flex w-full items-center justify-between gap-3'>
                      <Input
                        id='defendantCity'
                        value={clientData.defendant.city}
                        placeholder='City'
                        onChange={e =>
                          handleDefendantChange('city', e.target.value)
                        }
                      />
                      <Input
                        id='defendantZip'
                        value={clientData.defendant.zip}
                        placeholder='Zip'
                        onChange={e =>
                          handleDefendantChange('zip', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !clientData.defendant.dob && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon />
                          {clientData.defendant.dob
                            ? format(clientData.defendant.dob, 'PPP')
                            : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={clientData.defendant.dob}
                          onSelect={date => handleDefendantChange('dob', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='space-y-1'>
                    <Label>Mobile</Label>
                    <Input
                      id='defendantMobile'
                      value={clientData.defendant.mobile}
                      placeholder='Mobile'
                      onChange={e =>
                        handleDefendantChange('mobile', e.target.value)
                      }
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label>Fault</Label>
                    <Input
                      id='defendantFault'
                      value={clientData.defendant.fault}
                      placeholder='Fault'
                      onChange={e =>
                        handleDefendantChange('fault', e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='Marriage'>
              <Card>
                <CardHeader>
                  <CardTitle>Marriage</CardTitle>
                  <CardDescription>
                    Enter the marriage details of the client
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label>Date of Marriage</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={`w-full justify-start text-left font-normal ${
                          !clientData.marriage.dateOfMarriage &&
                          'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon />
                        {clientData.marriage.dateOfMarriage
                          ? format(clientData.marriage.dateOfMarriage, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={clientData.marriage.dateOfMarriage}
                        onSelect={date =>
                          handleFieldChange('marriage', 'dateOfMarriage', date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Label htmlFor='cityOfMarriage'>City of Marriage</Label>
                  <Input
                    id='cityOfMarriage'
                    value={clientData.marriage.cityOfMarriage}
                    placeholder='City of Marriage'
                    onChange={e =>
                      handleFieldChange(
                        'marriage',
                        'cityOfMarriage',
                        e.target.value
                      )
                    }
                  />
                  <Label>Date of Separation</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={`w-full justify-start text-left font-normal ${
                          !clientData.marriage.dateOfSeparation &&
                          'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon />
                        {clientData.marriage.dateOfSeparation
                          ? format(clientData.marriage.dateOfSeparation, 'PPP')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={clientData.marriage.dateOfSeparation}
                        onSelect={date =>
                          handleFieldChange(
                            'marriage',
                            'dateOfSeparation',
                            date
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='Children'>
              <Card>
                <CardHeader>
                  <CardTitle>Children</CardTitle>
                  <CardDescription>Enter the Children details</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label>No of Children</Label>
                  <Input
                    type='number'
                    min={1}
                    value={clientData.children.count}
                    onChange={e =>
                      handleChildrenCountChange(Number(e.target.value))
                    }
                    className='border rounded px-2 py-1 w-20'
                  />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='text-center w-16'>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Place of Birth</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead>Sex</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientData.children.details.map((child, i) => (
                        <TableRow key={child.id}>
                          <TableCell className='text-center'>{i + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={child.name}
                              onChange={e =>
                                handleChildFieldChange(
                                  i,
                                  'name',
                                  e.target.value
                                )
                              }
                              placeholder={`Child ${i + 1} Name`}
                            />
                          </TableCell>
                          <TableCell>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  className={`w-full justify-start text-left font-normal ${
                                    !child.dob && 'text-muted-foreground'
                                  }`}
                                >
                                  <CalendarIcon className='mr-2 h-4 w-4' />
                                  {child.dob
                                    ? format(child.dob, 'PPP')
                                    : 'Pick a date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={child.dob}
                                  onSelect={date =>
                                    handleChildFieldChange(i, 'dob', date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={child.placeOfBirth}
                              onChange={e =>
                                handleChildFieldChange(
                                  i,
                                  'placeOfBirth',
                                  e.target.value
                                )
                              }
                              placeholder='Place of Birth'
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={child.ssn}
                              onChange={e =>
                                handleChildFieldChange(i, 'ssn', e.target.value)
                              }
                              placeholder='SSN'
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={child.sex}
                              onChange={e =>
                                handleChildFieldChange(i, 'sex', e.target.value)
                              }
                              placeholder='Sex'
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='Custody'>
              <Card>
                <CardHeader>
                  <CardTitle>Custody</CardTitle>
                  <CardDescription>Enter the custody details</CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {/* Physical Custody */}
                  <Label>Physical Custody</Label>
                  <Select
                    value={clientData.custody.physicalCustody}
                    onValueChange={value =>
                      handleFieldChange('custody', 'physicalCustody', value)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Physical Custody' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Physical Custody Options</SelectLabel>
                        <SelectItem value='Plaintiff'>Plaintiff</SelectItem>
                        <SelectItem value='Defendant'>Defendant</SelectItem>
                        <SelectItem value='Joint'>Joint Custody</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Legal Custody */}
                  <Label>Legal Custody</Label>
                  <Select
                    value={clientData.custody.legalCustody}
                    onValueChange={value =>
                      handleFieldChange('custody', 'legalCustody', value)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Legal Custody' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Legal Custody Options</SelectLabel>
                        <SelectItem value='Plaintiff'>Plaintiff</SelectItem>
                        <SelectItem value='Defendant'>Defendant</SelectItem>
                        <SelectItem value='Joint'>Joint Custody</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Visitation Limitation */}
                  <Label>Visitation Limitation</Label>
                  <Select
                    value={clientData.custody.visitationLimitation}
                    onValueChange={value =>
                      handleFieldChange(
                        'custody',
                        'visitationLimitation',
                        value
                      )
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Visitation Limitation' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Visitation Options</SelectLabel>
                        <SelectItem value='Unlimited'>Unlimited</SelectItem>
                        <SelectItem value='Supervised'>Supervised</SelectItem>
                        <SelectItem value='Mutually Determined'>
                          Mutually Determined
                        </SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Child Support */}
                  <Label>Child Support</Label>
                  <Select
                    value={clientData.custody.childSupport}
                    onValueChange={value =>
                      handleFieldChange('custody', 'childSupport', value)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Child Support' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Child Support Options</SelectLabel>
                        <SelectItem value='Plaintiff'>
                          Plaintiff Pays
                        </SelectItem>
                        <SelectItem value='Defendant'>
                          Defendant Pays
                        </SelectItem>
                        <SelectItem value='Shared'>
                          Shared Between Both Parties
                        </SelectItem>
                        <SelectItem value='Mutual'>
                          Mutually Determined
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {/* Support Amount and Duration */}
                  <Label>Support Amount</Label>
                  <div className='flex gap-2'>
                    <Input
                      value={clientData.custody.supportAmount}
                      onChange={e =>
                        handleFieldChange(
                          'custody',
                          'supportAmount',
                          e.target.value
                        )
                      }
                      placeholder='Enter Support Amount'
                      type='number'
                    />
                    <Select
                      value={clientData.custody.supportDuration}
                      onValueChange={value =>
                        handleFieldChange('custody', 'supportDuration', value)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Duration' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Duration</SelectLabel>
                          <SelectItem value='Weekly'>Weekly</SelectItem>
                          <SelectItem value='Monthly'>Monthly</SelectItem>
                          <SelectItem value='Annually'>Annually</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='CourtDecision'>
              <Card>
                <CardHeader>
                  <CardTitle>Court Decision</CardTitle>
                  <CardDescription>
                    Enter the court decision details
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='previousDocketNumber'>
                      Previous Docket Number
                    </Label>
                    <Input
                      id='previousDocketNumber'
                      placeholder='Enter previous docket number'
                      value={
                        clientData.courtDecision.previous?.docketNumber || ''
                      }
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            previous: {
                              ...prev.courtDecision.previous,
                              docketNumber: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='previousCaseName'>Previous Case Name</Label>
                    <Input
                      id='previousCaseName'
                      placeholder='Enter previous case name'
                      value={clientData.courtDecision.previous?.caseName || ''}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            previous: {
                              ...prev.courtDecision.previous,
                              caseName: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='previousCounty'>Previous County</Label>
                    <Input
                      id='previousCounty'
                      placeholder='Enter previous county'
                      value={clientData.courtDecision.previous?.county || ''}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            previous: {
                              ...prev.courtDecision.previous,
                              county: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currentDocketNumber'>
                      Current Docket Number
                    </Label>
                    <Input
                      id='currentDocketNumber'
                      placeholder='Enter current docket number'
                      value={
                        clientData.courtDecision.current?.docketNumber || ''
                      }
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            current: {
                              ...prev.courtDecision.current,
                              docketNumber: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currentCaseName'>Current Case Name</Label>
                    <Input
                      id='currentCaseName'
                      placeholder='Enter current case name'
                      value={clientData.courtDecision.current?.caseName || ''}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            current: {
                              ...prev.courtDecision.current,
                              caseName: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='currentCounty'>Current County</Label>
                    <Input
                      id='currentCounty'
                      placeholder='Enter current county'
                      value={clientData.courtDecision.current?.county || ''}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          courtDecision: {
                            ...prev.courtDecision,
                            current: {
                              ...prev.courtDecision.current,
                              county: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
            <TabsContent
              className={`w-full md:w-3/4`}
              value='RealEstateDetails'
            >
              <Card>
                <CardHeader>
                  <CardTitle>Real Estate Details</CardTitle>
                  <CardDescription>
                    Enter the real estate and personal property details below.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='property1'>Real Estate Details</Label>
                    <Input
                      id='property1'
                      placeholder='1. Enter property description'
                      value={
                        clientData.realEstateDetails.properties[0].description
                      }
                      onChange={e =>
                        handleRealEstateChange(0, 'description', e.target.value)
                      }
                    />
                    <div className='space-y-1'>
                      <Label htmlFor='equity1'>Equity</Label>
                      <Input
                        id='equity1'
                        placeholder='Enter equity amount'
                        value={
                          clientData.realEstateDetails.properties[0].equity
                        }
                        onChange={e =>
                          handleRealEstateChange(0, 'equity', e.target.value)
                        }
                      />
                    </div>
                    <Input
                      id='property2'
                      placeholder='2. Enter property description'
                      value={
                        clientData.realEstateDetails.properties[1].description
                      }
                      onChange={e =>
                        handleRealEstateChange(1, 'description', e.target.value)
                      }
                    />
                    <Input
                      id='property3'
                      placeholder='3. Enter property description'
                      value={
                        clientData.realEstateDetails.properties[2].description
                      }
                      onChange={e =>
                        handleRealEstateChange(2, 'description', e.target.value)
                      }
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Personal Property</Label>
                    <div className='space-y-1'>
                      <Label htmlFor='defendantProperty'>Defendant</Label>
                      <Input
                        id='defendantProperty'
                        placeholder='Enter defendant property details'
                        value={
                          clientData.realEstateDetails.personalProperty
                            .defendant
                        }
                        onChange={e =>
                          handlePersonalPropertyChange(
                            'defendant',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='plaintiffProperty'>Plaintiff</Label>
                      <Input
                        id='plaintiffProperty'
                        placeholder='Enter plaintiff property details'
                        value={
                          clientData.realEstateDetails.personalProperty
                            .plaintiff
                        }
                        onChange={e =>
                          handlePersonalPropertyChange(
                            'plaintiff',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='Insurance'>
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Details</CardTitle>
                  <CardDescription>
                    Do you have insurance? (Health/Life/Auto and Homeowners) If
                    so, provide details below.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>LIFE:</Label>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        placeholder='Company'
                        value={clientData.insurance.details.life.company}
                        onChange={e =>
                          handleInsuranceChange(
                            'life',
                            'company',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder='Policy#'
                        value={clientData.insurance.details.life.policy}
                        onChange={e =>
                          handleInsuranceChange(
                            'life',
                            'policy',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <Label>AUTO:</Label>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        placeholder='Company'
                        value={clientData.insurance.details.auto.company}
                        onChange={e =>
                          handleInsuranceChange(
                            'auto',
                            'company',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder='Policy#'
                        value={clientData.insurance.details.auto.policy}
                        onChange={e =>
                          handleInsuranceChange(
                            'auto',
                            'policy',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <Label>HEALTH:</Label>
                    <div className='grid grid-cols-3 gap-4'>
                      <Input
                        placeholder='Company'
                        value={clientData.insurance.details.health.company}
                        onChange={e =>
                          handleInsuranceChange(
                            'health',
                            'company',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder='Policy#'
                        value={clientData.insurance.details.health.policy}
                        onChange={e =>
                          handleInsuranceChange(
                            'health',
                            'policy',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder='GRP#'
                        value={clientData.insurance.details.health.group}
                        onChange={e =>
                          handleInsuranceChange(
                            'health',
                            'group',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className='flex items-center gap-4'>
                      <Label>Through Employment:</Label>
                      <Checkbox
                        checked={
                          clientData.insurance.details.health.throughEmployment
                        }
                        onCheckedChange={checked =>
                          handleInsuranceChange(
                            'health',
                            'throughEmployment',
                            checked === true // Ensure the value is a boolean
                          )
                        }
                      >
                        Through Employment
                      </Checkbox>
                    </div>

                    <Label>HOME OWNER'S:</Label>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        placeholder='Company'
                        value={clientData.insurance.details.homeowners.company}
                        onChange={e =>
                          handleInsuranceChange(
                            'homeowners',
                            'company',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder='Policy#'
                        value={clientData.insurance.details.homeowners.policy}
                        onChange={e =>
                          handleInsuranceChange(
                            'homeowners',
                            'policy',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='License'>
              <Card>
                <CardHeader>
                  <CardTitle>License</CardTitle>
                  <CardDescription>
                    Enter the details of various licenses held by the client.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Driver's License Section */}
                  <div className='space-y-2'>
                    <Label htmlFor='driverLicenseNumber'>
                      Driver's License Number
                    </Label>
                    <Input
                      id='driverLicenseNumber'
                      placeholder='License Number'
                      value={clientData.licenses.driversLicense.number}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            driversLicense: {
                              ...prev.licenses.driversLicense,
                              number: e.target.value
                            }
                          }
                        }))
                      }
                    />
                    <Label htmlFor='driverLicenseState'>State of Issue</Label>
                    <Input
                      id='driverLicenseState'
                      placeholder='State of Issue'
                      value={clientData.licenses.driversLicense.stateOfIssue}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            driversLicense: {
                              ...prev.licenses.driversLicense,
                              stateOfIssue: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  {/* Employer's Details Section */}
                  <div className='space-y-2'>
                    <Label htmlFor='employerName'>Employer Name</Label>
                    <Input
                      id='employerName'
                      placeholder='Employer Name'
                      value={clientData.licenses.employerDetails.name}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            employerDetails: {
                              ...prev.licenses.employerDetails,
                              name: e.target.value
                            }
                          }
                        }))
                      }
                    />
                    <Label htmlFor='employerContact'>Contact</Label>
                    <Input
                      id='employerContact'
                      placeholder='Contact Information'
                      value={clientData.licenses.employerDetails.contact}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            employerDetails: {
                              ...prev.licenses.employerDetails,
                              contact: e.target.value
                            }
                          }
                        }))
                      }
                    />
                    <Label htmlFor='employerAddress'>Address</Label>
                    <Input
                      id='employerAddress'
                      placeholder='Employer Address'
                      value={clientData.licenses.employerDetails.address}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            employerDetails: {
                              ...prev.licenses.employerDetails,
                              address: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>

                  {/* Professional/Recreational/Occupational Licenses */}
                  <div className='space-y-2'>
                    <Label htmlFor='professionalLicense'>
                      Professional/Recreational License
                    </Label>
                    <Input
                      id='professionalLicense'
                      placeholder='License Details'
                      value={clientData.licenses.professionalLicense.details}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          licenses: {
                            ...prev.licenses,
                            professionalLicense: {
                              ...prev.licenses.professionalLicense,
                              details: e.target.value
                            }
                          }
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
            <TabsContent
              className={`w-full md:w-3/4`}
              value='BiographicDetails'
            >
              <Card>
                <CardHeader>
                  <CardTitle>Biographic Details</CardTitle>
                  <CardDescription>
                    Please provide the biographic details and referral source
                    information.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Biographic Details Section */}
                  <div className='space-y-2'>
                    <Label htmlFor='gender'>Gender</Label>
                    <Select
                      value={clientData.biographicDetails.gender}
                      onValueChange={value =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            gender: value
                          }
                        }))
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender Options</SelectLabel>
                          <SelectItem value='Male'>Male</SelectItem>
                          <SelectItem value='Female'>Female</SelectItem>
                          <SelectItem value='Other'>Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Label htmlFor='race'>Race</Label>
                    <Input
                      id='race'
                      placeholder='Race'
                      value={clientData.biographicDetails.race}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            race: e.target.value
                          }
                        }))
                      }
                    />

                    <Label htmlFor='height'>Height</Label>
                    <Input
                      id='height'
                      placeholder='Height'
                      value={clientData.biographicDetails.height}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            height: e.target.value
                          }
                        }))
                      }
                    />

                    <Label htmlFor='weight'>Weight</Label>
                    <Input
                      id='weight'
                      placeholder='Weight'
                      value={clientData.biographicDetails.weight}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            weight: e.target.value
                          }
                        }))
                      }
                    />

                    <Label htmlFor='eyeColor'>Color of Eyes</Label>
                    <Input
                      id='eyeColor'
                      placeholder='Color of Eyes'
                      value={clientData.biographicDetails.eyeColor}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            eyeColor: e.target.value
                          }
                        }))
                      }
                    />

                    <Label htmlFor='hairColor'>Color of Hair</Label>
                    <Input
                      id='hairColor'
                      placeholder='Color of Hair'
                      value={clientData.biographicDetails.hairColor}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          biographicDetails: {
                            ...prev.biographicDetails,
                            hairColor: e.target.value
                          }
                        }))
                      }
                    />
                  </div>

                  {/* Referral Source Section */}
                  <div className='space-y-2'>
                    <Label htmlFor='referralMedia'>How did you find us?</Label>
                    <Select
                      value={clientData.referralSource.media}
                      onValueChange={value =>
                        setClientData(prev => ({
                          ...prev,
                          referralSource: {
                            ...prev.referralSource,
                            media: value
                          }
                        }))
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select How You Found Us' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Referral Source</SelectLabel>
                          <SelectItem value='Newspaper'>Newspaper</SelectItem>
                          <SelectItem value='Street Sign'>
                            Street Sign
                          </SelectItem>
                          <SelectItem value='Internet'>Internet</SelectItem>
                          <SelectItem value='Friend'>Friend</SelectItem>
                          <SelectItem value='Other'>Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Label htmlFor='nameOfMedia'>
                      Name of the Newspaper/Source
                    </Label>
                    <Input
                      id='nameOfMedia'
                      placeholder='Name of the Newspaper/Source'
                      value={clientData.referralSource.nameOfMedia}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          referralSource: {
                            ...prev.referralSource,
                            nameOfMedia: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='SheriffAddress'>
              <Card>
                <CardHeader>
                  <CardTitle>Sheriff Address</CardTitle>
                  <CardDescription>
                    Enter the address details for the Sheriff.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Address Line 1 */}
                  <div className='space-y-2'>
                    <Label htmlFor='addressLine1'>Address Line 1</Label>
                    <Input
                      id='addressLine1'
                      placeholder='Address Line 1'
                      value={clientData.sheriffAddress.addressLine1}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          sheriffAddress: {
                            ...prev.sheriffAddress,
                            addressLine1: e.target.value
                          }
                        }))
                      }
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className='space-y-2'>
                    <Label htmlFor='addressLine2'>Address Line 2</Label>
                    <Input
                      id='addressLine2'
                      placeholder='Address Line 2'
                      value={clientData.sheriffAddress.addressLine2}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          sheriffAddress: {
                            ...prev.sheriffAddress,
                            addressLine2: e.target.value
                          }
                        }))
                      }
                    />
                  </div>

                  {/* City, Notes, State, and Zip */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <div>
                      <Label htmlFor='city'>City</Label>
                      <Input
                        id='city'
                        placeholder='City'
                        value={clientData.sheriffAddress.city}
                        onChange={e =>
                          setClientData(prev => ({
                            ...prev,
                            sheriffAddress: {
                              ...prev.sheriffAddress,
                              city: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='notes'>Notes</Label>
                      <Input
                        id='notes'
                        placeholder='Notes'
                        value={clientData.sheriffAddress.notes}
                        onChange={e =>
                          setClientData(prev => ({
                            ...prev,
                            sheriffAddress: {
                              ...prev.sheriffAddress,
                              notes: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor='state'>State</Label>
                      <Select
                        value={clientData.sheriffAddress.state}
                        onValueChange={value =>
                          setClientData(prev => ({
                            ...prev,
                            sheriffAddress: {
                              ...prev.sheriffAddress,
                              state: value
                            }
                          }))
                        }
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select State' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>State Options</SelectLabel>
                            <SelectItem value='NY'>New York</SelectItem>
                            <SelectItem value='NJ'>New Jersey</SelectItem>
                            <SelectItem value='CA'>California</SelectItem>
                            <SelectItem value='TX'>Texas</SelectItem>
                            {/* Add more states as needed */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor='zip'>Zip</Label>
                      <Input
                        id='zip'
                        placeholder='Zip'
                        value={clientData.sheriffAddress.zip}
                        onChange={e =>
                          setClientData(prev => ({
                            ...prev,
                            sheriffAddress: {
                              ...prev.sheriffAddress,
                              zip: e.target.value
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent className={`w-full md:w-3/4`} value='ServiceFee'>
              <Card>
                <CardHeader>
                  <CardTitle>Service Fee</CardTitle>
                  <CardDescription>
                    Enter the service fee details for the client.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='serviceFee'>Service Fee</Label>
                    <Input
                      id='serviceFee'
                      placeholder='Service Fee'
                      value={clientData.serviceFee}
                      onChange={e =>
                        setClientData(prev => ({
                          ...prev,
                          serviceFee: e.target.value
                        }))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                  >
                    Submit{' '}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Page
