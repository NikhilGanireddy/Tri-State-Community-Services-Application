import User from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';

export async function POST(req) {
  try {
    await connectToDB();

    const clientData = await req.json(); // Read the request body

    // Create a new user document using the schema
    const user = new User(clientData);
    await user.save();

    return new Response(JSON.stringify({ message: 'Client data saved successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving client data:', error);
    return new Response(JSON.stringify({ message: 'Error saving client data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}