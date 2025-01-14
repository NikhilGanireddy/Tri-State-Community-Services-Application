"use client"
import * as React from "react"
import {useEffect, useState} from "react"
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"

const Page = () => {
    // State for Plaintiff and Defendant Data
    const [clientData, setClientData] = useState({
        plaintiff: {
            firstName: "",
            middleName: "",
            lastName: "",
            maidenName: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            dob: null,
            mobile: "",
            placeOfBirth: "",
        },
        defendant: {
            firstName: "",
            middleName: "",
            lastName: "",
            maidenName: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            dob: null,
            mobile: "",
            placeOfBirth: "",
        },
        marriage: {
            dateOfMarriage: null,
            cityOfMarriage: "",
            stateOfMarriage: "",
            dateOfSeparation: null,
        },
        children: {
            count: 1,
            details: [
                {
                    id: "0",
                    name: "",
                    dob: null,
                    placeOfBirth: "",
                    ssn: "",
                    sex: "",
                },
            ],
        },
        custody: {
            physicalCustody: "",
            legalCustody: "",
            visitationLimitation: "",
            childSupport: "",
            supportAmount: "",
            supportFrequency: "",
        },
    });
    console.log(clientData)
    const handleFieldChange = (category, field, value) => {
        setClientData((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value,
            },
        }));
    };


    const handleChildFieldChange = (index, field, value) => {
        setClientData((prev) => {
            const updatedChildren = [...prev.children.details];
            updatedChildren[index] = { ...updatedChildren[index], [field]: value };
            return {
                ...prev,
                children: { ...prev.children, details: updatedChildren },
            };
        });
    };

    const handleChildrenCountChange = (count) => {
        setClientData((prev) => {
            const updatedChildren = [...prev.children.details];
            const currentCount = updatedChildren.length;

            if (count > currentCount) {
                const newChildren = Array.from({ length: count - currentCount }, (_, i) => ({
                    id: `${currentCount + i}`,
                    name: "",
                    dob: null,
                    placeOfBirth: "",
                    ssn: "",
                    sex: "",
                }));
                return {
                    ...prev,
                    children: { count, details: [...updatedChildren, ...newChildren] },
                };
            } else if (count < currentCount) {
                return {
                    ...prev,
                    children: { count, details: updatedChildren.slice(0, count) },
                };
            }
            return prev;
        });
    };
    const handlePlaintiffChange = (field, value) => {
        setClientData(prev => ({
            ...prev, plaintiff: {
                ...prev.plaintiff, [field]: value
            }
        }));
    };

    const handleDefendantChange = (field, value) => {
        setClientData(prev => ({
            ...prev, defendant: {
                ...prev.defendant, [field]: value
            }
        }));
    };
    const handleSaveChildrenData = () => {
        // Your logic to save or process the data goes here
        console.log('Saving children data', clientData);
        // Example: you could send clientData to an API or local storage
    };
    const [date, setDate] = React.useState();
    const [childrenCount, setChildrenCount] = useState(1);

    const [childrenData, setChildrenData] = useState([{
        id: "0", name: "", dob: null, placeOfBirth: "", ssn: "", sex: "",
    },]);

    useEffect(() => {
        setChildrenData((prev) => {
            if (prev.length === childrenCount) return prev;
            if (prev.length < childrenCount) {
                const itemsToAdd = childrenCount - prev.length;
                const newItems = Array.from({length: itemsToAdd}, (_, idx) => ({
                    id: String(prev.length + idx), name: "", dob: null, placeOfBirth: "", ssn: "", sex: "",
                }));
                return [...prev, ...newItems];
            }
            return prev.slice(0, childrenCount);
        });
    }, [childrenCount]);

    const renderChildrenInputs = () => {
        return childrenData.map((child, i) => (<TableRow key={child.id}>
            <TableCell className="text-center">{i + 1}</TableCell>
            <TableCell>
                <Input
                    type="text"
                    placeholder={`Child ${i + 1} Name`}
                    value={child.name}
                    onChange={(e) => handleChildFieldChange(i, "name", e.target.value)}
                />
            </TableCell>
            <TableCell>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !child.dob && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {child.dob ? format(child.dob, "PPP") : "Pick a date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={child.dob}
                            onSelect={(date) => handleChildDateChange(i, date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    placeholder="Place of Birth"
                    value={child.placeOfBirth}
                    onChange={(e) => handleChildFieldChange(i, "placeOfBirth", e.target.value)}
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    placeholder="SSN"
                    value={child.ssn}
                    onChange={(e) => handleChildFieldChange(i, "ssn", e.target.value)}
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    placeholder="Sex"
                    value={child.sex}
                    onChange={(e) => handleChildFieldChange(i, "sex", e.target.value)}
                />
            </TableCell>
        </TableRow>));
    }
    return (<div className={` max-w-[1200px] mx-auto rounded-2xl py-12 px-4`}>
        <h1 className={`text-2xl font-semibold`}>Tri State Community Services</h1>
        <h2 className={`text-xl`}>Intake Sheet</h2>

        <div>
            <Separator className={`my-4`}/>
            <div>
                <Tabs defaultValue="Plaintiff" className="w-full h-full flex flex-col md:flex-row  gap-4 p-4">
                    <TabsList
                        className="bg-transparent flex flex-row md:flex-col w-full md:w-1/4 h-full px-0 md:px-1 justify-start items-start overflow-x-scroll">
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Plaintiff">Plaintiff</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Defendant">Defendant</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Marriage">Marriage</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Children">Children</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Custody">Custody</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="CourtDecision">Court Decision</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="RealEstateDetails">Real Estate Details</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="Insurance">Insurance</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="License">License</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="BiographicDetails">Biographic Details</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="SheriffAddress">Sheriff Address</TabsTrigger>
                        <TabsTrigger className={`w-full py-2 px-2 text-left flex justify-start items-start`}
                                     value="ServiceFee">Service Fee</TabsTrigger>
                    </TabsList>
                    <TabsContent className={`w-full md:w-3/4`} value="Plaintiff">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plaintiff</CardTitle>
                                <CardDescription>
                                    Enter the Plaintiff details of the client
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fName">First Name</Label>
                                    <Input id="fName" value={clientData.plaintiff.firstName} placeholder="First Name"
                                           onChange={(e) => handlePlaintiffChange("firstName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="mName">Middle Name</Label>
                                    <Input id="mName" value={clientData.plaintiff.middleName} placeholder="Middle Name"
                                           onChange={(e) => handlePlaintiffChange("middleName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="lName">Last Name</Label>
                                    <Input id="lName" value={clientData.plaintiff.lastName} placeholder="Last Name"
                                           onChange={(e) => handlePlaintiffChange("lastName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="maidenName">Maiden Name</Label>
                                    <Input id="maidenName" value={clientData.plaintiff.maidenName} placeholder="Maiden Name"
                                           onChange={(e) => handlePlaintiffChange("maidenName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <div className="space-y-3">
                                        <Label>Address</Label>
                                        <Input id="address1" value={clientData.plaintiff.address1} placeholder="Address line 1"
                                               onChange={(e) => handlePlaintiffChange("address1", e.target.value)} />
                                        <Input id="address2" value={clientData.plaintiff.address2} placeholder="Address line 2"
                                               onChange={(e) => handlePlaintiffChange("address2", e.target.value)} />
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <Input id="city" value={clientData.plaintiff.city} placeholder="City"
                                                   onChange={(e) => handlePlaintiffChange("city", e.target.value)} />
                                            <Input id="zip" value={clientData.plaintiff.zip} placeholder="Zip"
                                                   onChange={(e) => handlePlaintiffChange("zip", e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Date of Birth</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal", !clientData.plaintiff.dob && "text-muted-foreground")}
                                            >
                                                <CalendarIcon />
                                                {clientData.plaintiff.dob ? format(clientData.plaintiff.dob, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={clientData.plaintiff.dob}
                                                onSelect={(date) => handlePlaintiffChange("dob", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label>Place of Birth</Label>
                                    <Input id="placeOfBirth" value={clientData.plaintiff.placeOfBirth} placeholder="Place of Birth"
                                           onChange={(e) => handlePlaintiffChange("placeOfBirth", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Mobile</Label>
                                    <Input id="mobile" value={clientData.plaintiff.mobile} placeholder="Mobile"
                                           onChange={(e) => handlePlaintiffChange("mobile", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Checkbox
                                        checked={clientData.plaintiff.inNewJersey}
                                        onCheckedChange={(checked) => handlePlaintiffChange("inNewJersey", checked)}
                                    >
                                        Resides in New Jersey
                                    </Checkbox>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent className={`w-full md:w-3/4`} value="Defendant">
                        <Card>
                            <CardHeader>
                                <CardTitle>Defendant</CardTitle>
                                <CardDescription>
                                    Enter the Defendant details of the client
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="defendantFirstName">First Name</Label>
                                    <Input id="defendantFirstName" value={clientData.defendant.firstName} placeholder="First Name"
                                           onChange={(e) => handleDefendantChange("firstName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="defendantMiddleName">Middle Name</Label>
                                    <Input id="defendantMiddleName" value={clientData.defendant.middleName} placeholder="Middle Name"
                                           onChange={(e) => handleDefendantChange("middleName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="defendantLastName">Last Name</Label>
                                    <Input id="defendantLastName" value={clientData.defendant.lastName} placeholder="Last Name"
                                           onChange={(e) => handleDefendantChange("lastName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="defendantMaidenName">Maiden Name</Label>
                                    <Input id="defendantMaidenName" value={clientData.defendant.maidenName} placeholder="Maiden Name"
                                           onChange={(e) => handleDefendantChange("maidenName", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Address</Label>
                                    <Input id="defendantAddress1" value={clientData.defendant.address1} placeholder="Address line 1"
                                           onChange={(e) => handleDefendantChange("address1", e.target.value)} />
                                    <Input id="defendantAddress2" value={clientData.defendant.address2} placeholder="Address line 2"
                                           onChange={(e) => handleDefendantChange("address2", e.target.value)} />
                                    <div className="flex w-full items-center justify-between gap-3">
                                        <Input id="defendantCity" value={clientData.defendant.city} placeholder="City"
                                               onChange={(e) => handleDefendantChange("city", e.target.value)} />
                                        <Input id="defendantZip" value={clientData.defendant.zip} placeholder="Zip"
                                               onChange={(e) => handleDefendantChange("zip", e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label>Date of Birth</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal", !clientData.defendant.dob && "text-muted-foreground")}
                                            >
                                                <CalendarIcon />
                                                {clientData.defendant.dob ? format(clientData.defendant.dob, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={clientData.defendant.dob}
                                                onSelect={(date) => handleDefendantChange("dob", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label>Mobile</Label>
                                    <Input id="defendantMobile" value={clientData.defendant.mobile} placeholder="Mobile"
                                           onChange={(e) => handleDefendantChange("mobile", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Fault</Label>
                                    <Input id="defendantFault" value={clientData.defendant.fault} placeholder="Fault"
                                           onChange={(e) => handleDefendantChange("fault", e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="Marriage">
                        <Card>
                            <CardHeader>
                                <CardTitle>Marriage</CardTitle>
                                <CardDescription>Enter the marriage details of the client</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Label>Date of Marriage</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${
                                                !clientData.marriage.dateOfMarriage &&
                                                "text-muted-foreground"
                                            }`}
                                        >
                                            <CalendarIcon />
                                            {clientData.marriage.dateOfMarriage
                                                ? format(clientData.marriage.dateOfMarriage, "PPP")
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={clientData.marriage.dateOfMarriage}
                                            onSelect={(date) =>
                                                handleFieldChange("marriage", "dateOfMarriage", date)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Label htmlFor="cityOfMarriage">City of Marriage</Label>
                                <Input
                                    id="cityOfMarriage"
                                    value={clientData.marriage.cityOfMarriage}
                                    placeholder="City of Marriage"
                                    onChange={(e) =>
                                        handleFieldChange("marriage", "cityOfMarriage", e.target.value)
                                    }
                                />
                                <Label>Date of Separation</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${
                                                !clientData.marriage.dateOfSeparation &&
                                                "text-muted-foreground"
                                            }`}
                                        >
                                            <CalendarIcon />
                                            {clientData.marriage.dateOfSeparation
                                                ? format(clientData.marriage.dateOfSeparation, "PPP")
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={clientData.marriage.dateOfSeparation}
                                            onSelect={(date) =>
                                                handleFieldChange("marriage", "dateOfSeparation", date)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="Children">
                        <Card>
                            <CardHeader>
                                <CardTitle>Children</CardTitle>
                                <CardDescription>Enter the Children details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Label>No of Children</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={clientData.children.count}
                                    onChange={(e) =>
                                        handleChildrenCountChange(Number(e.target.value))
                                    }
                                    className="border rounded px-2 py-1 w-20"
                                />
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center w-16">#</TableHead>
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
                                                <TableCell className="text-center">{i + 1}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={child.name}
                                                        onChange={(e) =>
                                                            handleChildFieldChange(i, "name", e.target.value)
                                                        }
                                                        placeholder={`Child ${i + 1} Name`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={`w-full justify-start text-left font-normal ${
                                                                    !child.dob && "text-muted-foreground"
                                                                }`}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {child.dob ? format(child.dob, "PPP") : "Pick a date"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={child.dob}
                                                                onSelect={(date) =>
                                                                    handleChildFieldChange(i, "dob", date)
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={child.placeOfBirth}
                                                        onChange={(e) =>
                                                            handleChildFieldChange(i, "placeOfBirth", e.target.value)
                                                        }
                                                        placeholder="Place of Birth"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={child.ssn}
                                                        onChange={(e) =>
                                                            handleChildFieldChange(i, "ssn", e.target.value)
                                                        }
                                                        placeholder="SSN"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={child.sex}
                                                        onChange={(e) =>
                                                            handleChildFieldChange(i, "sex", e.target.value)
                                                        }
                                                        placeholder="Sex"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="Custody">
                        <Card>
                            <CardHeader>
                                <CardTitle>Custody</CardTitle>
                                <CardDescription>Enter the custody details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {/* Physical Custody */}
                                <Label>Physical Custody</Label>
                                <Select
                                    value={clientData.custody.physicalCustody}
                                    onValueChange={(value) =>
                                        handleFieldChange("custody", "physicalCustody", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Physical Custody" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Physical Custody Options</SelectLabel>
                                            <SelectItem value="Plaintiff">Plaintiff</SelectItem>
                                            <SelectItem value="Defendant">Defendant</SelectItem>
                                            <SelectItem value="Joint">Joint Custody</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* Legal Custody */}
                                <Label>Legal Custody</Label>
                                <Select
                                    value={clientData.custody.legalCustody}
                                    onValueChange={(value) =>
                                        handleFieldChange("custody", "legalCustody", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Legal Custody" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Legal Custody Options</SelectLabel>
                                            <SelectItem value="Plaintiff">Plaintiff</SelectItem>
                                            <SelectItem value="Defendant">Defendant</SelectItem>
                                            <SelectItem value="Joint">Joint Custody</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* Visitation Limitation */}
                                <Label>Visitation Limitation</Label>
                                <Select
                                    value={clientData.custody.visitationLimitation}
                                    onValueChange={(value) =>
                                        handleFieldChange("custody", "visitationLimitation", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Visitation Limitation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Visitation Options</SelectLabel>
                                            <SelectItem value="Unlimited">Unlimited</SelectItem>
                                            <SelectItem value="Supervised">Supervised</SelectItem>
                                            <SelectItem value="Mutually Determined">
                                                Mutually Determined
                                            </SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* Child Support */}
                                <Label>Child Support</Label>
                                <Select
                                    value={clientData.custody.childSupport}
                                    onValueChange={(value) =>
                                        handleFieldChange("custody", "childSupport", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Child Support" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Child Support Options</SelectLabel>
                                            <SelectItem value="Plaintiff">Plaintiff Pays</SelectItem>
                                            <SelectItem value="Defendant">Defendant Pays</SelectItem>
                                            <SelectItem value="Shared">
                                                Shared Between Both Parties
                                            </SelectItem>
                                            <SelectItem value="Mutual">Mutually Determined</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* Support Amount and Duration */}
                                <Label>Support Amount</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={clientData.custody.supportAmount}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "custody",
                                                "supportAmount",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter Support Amount"
                                        type="number"
                                    />
                                    <Select
                                        value={clientData.custody.supportDuration}
                                        onValueChange={(value) =>
                                            handleFieldChange("custody", "supportDuration", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Duration</SelectLabel>
                                                <SelectItem value="Weekly">Weekly</SelectItem>
                                                <SelectItem value="Monthly">Monthly</SelectItem>
                                                <SelectItem value="Annually">Annually</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="CourtDecision">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="RealEstateDetails">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="Insurance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="License">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="BiographicDetails">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="SheriffAddress">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent className={`w-full md:w-3/4`} value="ServiceFee">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password"/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        {/*<div className={`w-full`}>*/}
        {/*    <form className={`flex flex-col items-center gap-4 mx-auto w-full`}>*/}
        {/*        <div className={`flex lg:flex-row sm:flex-col justify-between items-center w-full gap-8 border-[0.5px] rounded-2xl border-neutral-300`}>*/}
        {/*            <div*/}
        {/*                className={`plaintiff flex flex-col w-full justify-between items-center gap-6 p-4 `}>*/}
        {/*                <h1 className={`text-2xl font-bold`}>Plaintiff</h1>*/}
        {/*                <div className={`name flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Name</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`First Name`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`Middle Name`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`Last Name`}/>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`maiden-name flex justify-between text-nowrap items-center w-full sm:flex-col gap-4`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-maiden-name">Maiden*/}
        {/*                            Name</Label>*/}
        {/*                        <Input className={`rounded-xl`} id={`plantiff-maiden-name`}*/}
        {/*                               placeholder={`Maiden Name`}/>*/}

        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`address flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Address</Label>*/}
        {/*                        <div className={`flex sm:flex-col w-full items-center gap-3`}>*/}
        {/*                            <Input className={`rounded-xl`} id={`address-line-1`}*/}
        {/*                                   placeholder={`address line 1`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`address-line-2`}*/}
        {/*                                   placeholder={`address line 2`}/>*/}
        {/*                            <div className={`flex w-full items-center justify-between gap-3`}>*/}
        {/*                                <Input className={`rounded-xl`} id={`address-line-2`} placeholder={`City`}/>*/}
        {/*                                <Input className={`rounded-xl`} id={`zip`} placeholder={`Zip`}/>*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`date-of-birth flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Date of*/}
        {/*                            Birth</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}
        {/*                            <Popover>*/}
        {/*                                <PopoverTrigger asChild>*/}
        {/*                                    <Button*/}
        {/*                                        variant={"outline"}*/}
        {/*                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}*/}
        {/*                                    >*/}
        {/*                                        <CalendarIcon/>*/}
        {/*                                        {date ? format(date, "PPP") : <span>Pick a date</span>}*/}
        {/*                                    </Button>*/}
        {/*                                </PopoverTrigger>*/}
        {/*                                <PopoverContent className="w-auto p-0" align="start">*/}
        {/*                                    <Calendar*/}
        {/*                                        mode="single"*/}
        {/*                                        selected={date}*/}
        {/*                                        onSelect={setDate}*/}
        {/*                                        initialFocus*/}
        {/*                                    />*/}
        {/*                                </PopoverContent>*/}
        {/*                            </Popover>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`POB flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">POB</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}

        {/*                            <div className={`flex w-full items-center justify-between gap-3`}>*/}
        {/*                                <Input className={`rounded-xl`} id={`address-line-2`} placeholder={`City`}/>*/}
        {/*                                <Select>*/}
        {/*                                    <SelectTrigger className="w-full rounded-xl">*/}
        {/*                                        <SelectValue placeholder="Select a State"/>*/}
        {/*                                    </SelectTrigger>*/}
        {/*                                    <SelectContent>*/}
        {/*                                        <SelectGroup>*/}
        {/*                                            <SelectLabel>States</SelectLabel>*/}
        {/*                                            <SelectItem value="apple">New Jersey</SelectItem>*/}
        {/*                                            <SelectItem value="banana">Tennessee</SelectItem>*/}
        {/*                                            <SelectItem value="blueberry">Ohio</SelectItem>*/}
        {/*                                            <SelectItem value="grapes">New Jersey</SelectItem>*/}
        {/*                                            <SelectItem value="pineapple">Nevada</SelectItem>*/}
        {/*                                        </SelectGroup>*/}
        {/*                                    </SelectContent>*/}
        {/*                                </Select>*/}
        {/*                                <Input className={`rounded-xl`} id={`zip`} placeholder={`Zip`}/>*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`mobile flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="mobile">Mobile</Label>*/}
        {/*                        <Input className={`rounded-xl`} id={`mobile`}*/}
        {/*                               placeholder={`Mobile no`}/>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="in-nj">In New Jersey</Label>*/}
        {/*                        <Checkbox className={`rounded-xl`} id={`in-nj`}*/}
        {/*                                  placeholder={`address-line-1`}/>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*            </div>*/}
        {/*            <div*/}
        {/*                className={`DEFEDANT flex flex-col w-full justify-start items-center gap-6 p-4 `}>*/}
        {/*                <h1 className={`text-2xl font-bold`}>Defendant</h1>*/}
        {/*                <div className={`name flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Name</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`First Name`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`Middle Name`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`plantiff-name`} placeholder={`Last Name`}/>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`maiden-name flex justify-between text-nowrap items-center w-full sm:flex-col gap-4`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-maiden-name">Maiden*/}
        {/*                            Name</Label>*/}
        {/*                        <Input className={`rounded-xl`} id={`plantiff-maiden-name`}*/}
        {/*                               placeholder={`Maiden Name`}/>*/}

        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`address flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Address</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}
        {/*                            <Input className={`rounded-xl`} id={`address-line-1`}*/}
        {/*                                   placeholder={`address-line-1`}/>*/}
        {/*                            <Input className={`rounded-xl`} id={`address-line-2`}*/}
        {/*                                   placeholder={`address-line-2`}/>*/}
        {/*                            <div className={`flex w-full items-center justify-between gap-3`}>*/}
        {/*                                <Input className={`rounded-xl`} id={`address-line-2`} placeholder={`City`}/>*/}
        {/*                                <Input className={`rounded-xl`} id={`zip`} placeholder={`Zip`}/>*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`date-of-birth flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Date of*/}
        {/*                            Birth</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}
        {/*                            <Popover>*/}
        {/*                                <PopoverTrigger asChild>*/}
        {/*                                    <Button*/}
        {/*                                        variant={"outline"}*/}
        {/*                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}*/}
        {/*                                    >*/}
        {/*                                        <CalendarIcon/>*/}
        {/*                                        {date ? format(date, "PPP") : <span>Pick a date</span>}*/}
        {/*                                    </Button>*/}
        {/*                                </PopoverTrigger>*/}
        {/*                                <PopoverContent className="w-auto p-0" align="start">*/}
        {/*                                    <Calendar*/}
        {/*                                        mode="single"*/}
        {/*                                        selected={date}*/}
        {/*                                        onSelect={setDate}*/}
        {/*                                        initialFocus*/}
        {/*                                    />*/}
        {/*                                </PopoverContent>*/}
        {/*                            </Popover>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`mobile flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="mobile">Mobile</Label>*/}
        {/*                        <Input className={`rounded-xl`} id={`mobile`}*/}
        {/*                               placeholder={`Mobile no`}/>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*                <div*/}
        {/*                    className={`Fault flex justify-between text-nowrap items-center w-full sm:flex-col gap-`}>*/}
        {/*                    <div className={`flex w-full items-center justify-between gap-4`}>*/}
        {/*                        <Label className={`  text-lg font-semibold`} htmlFor="plantiff-name">Fault</Label>*/}
        {/*                        <div className={`flex sm:flex-col lg:flex-row w-full items-center gap-3`}>*/}

        {/*                            <div className={`flex w-full items-center justify-between gap-3`}>*/}
        {/*                                <Select>*/}
        {/*                                    <SelectTrigger className="w-full rounded-xl">*/}
        {/*                                        <SelectValue placeholder="Select the fault"/>*/}
        {/*                                    </SelectTrigger>*/}
        {/*                                    <SelectContent>*/}
        {/*                                        <SelectGroup>*/}
        {/*                                            <SelectLabel>Fault</SelectLabel>*/}
        {/*                                            <SelectItem value="apple">No Fault</SelectItem>*/}
        {/*                                            <SelectItem value="grapes">Irr. Diff.</SelectItem>*/}
        {/*                                        </SelectGroup>*/}
        {/*                                    </SelectContent>*/}
        {/*                                </Select>*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </form>*/}
        {/*</div>*/}
    </div>)
}

export default Page