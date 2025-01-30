import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import mongoose from 'mongoose';

export async function GET(req, context) {
  try {
    // Check if `params` is available

    await connectToDB();

    const { id } = await context.params; // Access dynamic parameter

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    // Fetch user data
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
