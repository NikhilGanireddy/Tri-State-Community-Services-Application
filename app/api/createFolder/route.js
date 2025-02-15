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

        // Create (if needed) a "documents" folder at project root:
        const documentsPath = path.join(process.cwd(), 'documents')
        if (!fs.existsSync(documentsPath)) {
            fs.mkdirSync(documentsPath, { recursive: true })
        }

        // Now create a subfolder named folderName:
        const targetPath = path.join(documentsPath, folderName)
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true })
        }

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