import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";

export async function POST(req) {
    try {
        const { id, clientData } = await req.json();

        if (!id || !clientData) {
            return new Response(JSON.stringify({ message: "Missing required data" }), { status: 400 });
        }

        await connectToDB();
        const updatedClient = await User.findByIdAndUpdate(id, clientData, { new: true });

        if (!updatedClient) {
            return new Response(JSON.stringify({ message: "Client not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Client data updated successfully", updatedClient }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error updating client data", error: error.message }), { status: 500 });
    }
}