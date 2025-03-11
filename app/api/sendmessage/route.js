// pages/api/sendMessage.js
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
    try {
        const { message, fName, lName, mobile, email } = await req.json();

        // Twilio Credentials (Use environment variables for security)
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        // Send message using Twilio
        const response = await client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `Name: ${fName} ${lName}\nMobile: +1${mobile}\nEmail: ${email}\n\nMessage: ${message}`,  // Use user input
            to: 'whatsapp:+18623804434'
        });

        return NextResponse.json({ success: true, sid: response.sid });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}