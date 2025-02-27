"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateUserParams,
  IGetAllUsersParams,
  IGetSavedQuestionsParams,
  IGetUserAnswers,
  IGetUserInfoParams,
  IGetUserQuestions,
  IToggleSaveQuestionParams,
  IUpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";

export async function getAllUsers(params: IGetAllUsersParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = {
          joinedAt: -1,
        };
        break;
      case "old_users":
        sortOptions = {
          joinedAt: 1,
        };
        break;
      case "top_contributors":
        sortOptions = {
          reputation: -1,
        };
        break;
      default:
        break;
    }

    const users = await User.find(query).sort(sortOptions);

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

    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: { sort: sortOptions },
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

export async function getUserInfo(params: IGetUserInfoParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const userInfo = await User.findOne({ clerkId: userId });
    if (!userInfo) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({
      author: userInfo._id,
    });
    const totalAnswers = await Answer.countDocuments({ author: userInfo._id });

    return { userInfo, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: IGetUserQuestions) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "clerkId _id name username picture");

    return { userQuestions, totalQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: IGetUserAnswers) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .sort({ createdAt: -1, upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId picture name");

    return { totalAnswers, userAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
