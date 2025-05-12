'use client'

import * as React from 'react'
import {useEffect, useState} from 'react'
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
import {getDate, getMonth, getYear} from 'date-fns'
import Link from 'next/link'
import {motion} from "framer-motion";
import useMousePosition from "@/utils/cursor";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useToast} from "@/hooks/use-toast"
import {Input} from "@/components/ui/input";
import { debounce } from 'lodash' // Import lodash debounce


const UsersPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const {toast} = useToast()
    // Function to fetch users from the API


    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    const handleDelete = async (userId) => {
        // if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`/api/deleteClient`, {
                method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify({id: userId}),
            });

            if (response.ok) {
                toast({
                    title: 'Success', description: "Client's data was successfully deleted from our servers."
                })
                // alert("User deleted successfully!");
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Error', description: `${errorData.message}`,
                })
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: 'Error', description: "Error deleting the client's data"
            })
        }
    };
    const {x, y} = useMousePosition();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/getClients')
                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const data = await response.json()
                setUsers(data)
                setFilteredUsers(data) // Set initial filtered data
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    // Function to handle search input
    const handleSearch = debounce((query) => {
        setSearchQuery(query)
        if (query.trim() === '') {
            setFilteredUsers(users) // Reset to original users list
        } else {
            const filtered = users.filter(user =>
                user.plaintiff.firstName.toLowerCase().includes(query.toLowerCase()) ||
                user.plaintiff.lastName.toLowerCase().includes(query.toLowerCase()) ||
                user.defendant.firstName.toLowerCase().includes(query.toLowerCase()) ||
                user.defendant.lastName.toLowerCase().includes(query.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }, 300)


    return (<div
        className=" relative overflow-x-hidden overflow-y-auto bg-fixed bg-cover bg-center h-full flex flex-col items-center justify-center bg-[url('/Wall2.jpg')] bg-white/20 min-h-screen">
        <div
            className="w-[90%] text-base max-w-[1600px] flex flex-col  items-center p-8 rounded-3xl min-h-[90vh] max-h-[90vh] overflow-y-auto shadow-2xl bg-white/10 h-full backdrop-blur-md">
            <div className={`flex justify-between items-center w-full `}>
                <Link href={'/application/dashboard'} className={`text-xl md:text-4xl font-semibold w-max`}>
                    Tri State Community Services
                </Link>
                <Link href={'/application/dashboard'} className={`text-sm md:text-base font-semibold w-max`}>
                    <Button>Dashboard</Button>
                </Link>
            </div>
            <div className="w-full max-w-md mt-12">
                <Input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-3  border rounded-lg"
                />
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className='text-red-500'>{error}</p>}

            {!loading && !error && filteredUsers.length > 0 ? (<div className={`w-full mt-6`}>
                <Table className={`md:text-sm w-full md:w-1/2 mx-auto`}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Plaintiff</TableHead>
                            <TableHead>Defendant</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={``}>
                        {filteredUsers.map(user => (
                            <TableRow className={``} key={user._id}>
                                <TableCell>{user.plaintiff.firstName} {user.plaintiff.lastName}</TableCell>
                                <TableCell>{user.defendant.firstName} {user.defendant.lastName}</TableCell>
                                <TableCell>{`${getMonth(user.dateCreated) + 1}-${getDate(user.dateCreated)}-${getYear(user.dateCreated)}`}</TableCell>
                                <TableCell className='text-right flex gap-2 justify-end items-center'>
    <span>
    <Link href={`/application/clients/${user._id}`}>
<svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='size-5'
>
    <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
    />
    </svg>
</Link>
</span>
                                    <span>
                    {' '}
                                        <Link href={`/application/document_templates/${user._id}`}>
                      <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          className='size-5'
                      >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z'
                        />
                      </svg>
                    </Link>
                  </span>
                                    <AlertDialog>
                                        <AlertDialogTrigger className={``}>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                                className='size-5'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                                                />
                                            </svg>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the client's
                                                    data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(user._id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <span onClick={() => handleDelete(user._id)}>

                  </span>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total Clients</TableCell>
                            <TableCell className="text-right">{filteredUsers.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>) : (!loading && <p>No users found.</p>)}
        </div>
    </div>)
}

export default UsersPage






