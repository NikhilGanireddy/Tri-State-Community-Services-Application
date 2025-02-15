// app/api/createFolder/route.js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
    try {
        const { folderName } = await request.json()

        if (!folderName) {
            return NextResponse.json(
                { error: 'folderName is required' },
                { status: 400 }
            )
        }
        console.log(folderName)

        return NextResponse.json({
            success: true,
            message: `Folder '${folderName}' created at ${targetPath}.`
        })
    } catch (error) {
        console.error('Error creating folder:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}