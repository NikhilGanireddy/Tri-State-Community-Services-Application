import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';

export async function POST(req) {
  try {
    await connectToDB();
    const { civilActionComplaintForDivorce, id, documentName } = await req.json();

    if (documentName === 'civilActionComplaintForDivorce') {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id }, // Ensure `_id` is used instead of `id` if it's a MongoDB ObjectId
        {
          $set: {
            'documentTemplatesExtraDetails.civilActionComplaintForDivorce': civilActionComplaintForDivorce,
          },
        },
        { new: true, upsert: true }
      );

      return new Response(
        JSON.stringify({ message: 'Data saved successfully!', data: updatedUser }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Invalid document name' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error saving data:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
