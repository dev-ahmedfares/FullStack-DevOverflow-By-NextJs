import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateUserParams,
  IGetAllUsersParams,
  IUpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getAllUsers(params: IGetAllUsersParams) {
  try {
    connectToDatabase();
    // const {page,pageSize,filter,searchQuery} = params
    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: { id: string }) {
  try {
    connectToDatabase();

    const { id } = params;
    const user = await User.findOne({ clerkId: id });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: ICreateUserParams) {
  try {
    connectToDatabase();

    const mongoUser = await User.create(userData);

    return mongoUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: IUpdateUserParams) {
  try {
    connectToDatabase();
    await User.findOneAndUpdate(
      { clerkId: userData.clerkId },
      userData.userData,
      { new: true },
    );

    revalidatePath(userData.path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(clerkId: string) {
  try {
    connectToDatabase();
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete User from database
    // and questions, answers and comments , etc..

    // Get user questions IDs
    // const userQuestionsIds = await Question.find({ author: user._id }).distinct(
    //   "_id",
    // );

    // For delete all question related with this user id
    await Question.deleteMany({ author: user._id });

    // TODO Delete answers, comments user

    // Delete user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
