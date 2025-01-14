"use server"

import {connectToDB} from "@/lib/mongoose";
import UserModel from "@/lib/models/user.model";

export async function updateUser() {
    connectToDB()

    try {
        await UserModel.findOneAndUpdate(
            {


            },
            {upsert: true},
        )
    } catch (error) {
        throw new Error(`Failed to upload the client data: ${error.message}`);
    }
}