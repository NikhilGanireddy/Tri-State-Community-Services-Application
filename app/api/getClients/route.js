import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectToDB();

    // Fetch all users from the database
    const users = await User.find({});

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ message: 'Error fetching users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
