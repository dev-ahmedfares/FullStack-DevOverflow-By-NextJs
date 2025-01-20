import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { ICreateUserParams } from "./shared.types";

export async function getUserById(params: {id:string}) {
  try {
    connectToDatabase();

    const { id } = params;
    const user = await User.findOne({ clerkId: id });
  
    return user
} catch (error) {
    console.log(error);
    throw error;
  }
}


export async function createUser(userData:ICreateUserParams) {
  try {
    connectToDatabase()

    const newUser =  await User.create(userData)

    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}