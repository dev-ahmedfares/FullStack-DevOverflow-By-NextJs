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
import { BadgeCriteriaType } from "@/types";
import { assignBadges, getErrorMessage } from "../utils";

export async function getAllUsers(params: IGetAllUsersParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

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

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getUserById(params: { id: string }) {
  try {
    connectToDatabase();

    const { id } = params;
    const user = await User.findOne({ clerkId: id });

    return user;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function createUser(userData: ICreateUserParams) {
  try {
    connectToDatabase();

    const mongoUser = await User.create(userData);

    return mongoUser;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateUser(userData: IUpdateUserParams) {
  try {
    connectToDatabase();
    const res = await User.findOneAndUpdate(
      { clerkId: userData.clerkId },
      userData.userData,
      { new: true },
    );
    
    revalidatePath(userData.path);
  } catch (error) {
   return { error: getErrorMessage(error) }
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
    return { error: getErrorMessage(error) }
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
    return { error: getErrorMessage(error) };
  }
}

export async function getSavedQuestions(params: IGetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, filter, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

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
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize + 1 },
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

    const isNext = savedQuestions.length > pageSize;

    return { questions: savedQuestions.slice(0, pageSize), isNext };
  } catch (error) {
    return { error: getErrorMessage(error) };
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

    const [questionUpVotes] = await Question.aggregate([
      {
        $match: { author: userInfo._id },
      },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },

      { $group: { _id: null, totalVotesQuestion: { $sum: "$upvotes" } } },
    ]);

    const [answerUpVotes] = await Answer.aggregate([
      { $match: { author: userInfo._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalVotesAnswer: { $sum: "$upvotes" } } },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: userInfo._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpVotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpVotes?.totalVotesAnswer || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];
    
    const badgeCounts = assignBadges({ criteria });

    return {
      userInfo,
      badgeCounts,
      totalQuestions,
      totalAnswers,
      reputation: userInfo.reputation,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getUserQuestions(params: IGetUserQuestions) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "clerkId _id name username picture");

    const isNextQuestion = totalQuestions > skipAmount + userQuestions.length;

    return { userQuestions, isNextQuestion };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getUserAnswers(params: IGetUserAnswers) {
  try {
    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ createdAt: -1, upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId picture name");

    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return { userAnswers, isNext };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
