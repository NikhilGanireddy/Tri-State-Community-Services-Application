import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ message: "Missing user ID" }), { status: 400 });
        }

        await connectToDB();
        const deletedClient = await User.findByIdAndDelete(id);

        if (!deletedClient) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error deleting user", error: error.message }), { status: 500 });
    }
}