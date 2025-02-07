"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateUserParams,
  IGetAllUsersParams,
  IGetSavedQuestionsParams,
  IToggleSaveQuestionParams,
  IUpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";

export async function getAllUsers(params: IGetAllUsersParams) {
  try {
    connectToDatabase();
    // const {page=1,pageSize=20,filter,searchQuery} = params
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

export async function toggleSaveQuestion(params: IToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user?.saved.includes(questionId)) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true },
      );
    } else {
      // saved the question
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, filter, page = 1, pageSize = 10, searchQuery } = params;

    // TODO Add pagination

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: { sort: { createdAt: -1 } },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    // TODO pagination NEXT

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
