"use server";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  IAnswerVoteParams,
  ICreateAnswerProps,
  IDeleteAnswerProps,
  IGetAllAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function createAnswer(params: ICreateAnswerProps) {
  try {
    connectToDatabase();
    const { author, content, question, path } = params;
    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    //  Add Answer Id to Question Answers Array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    //  ADD Interactions
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      tags: questionObject.tags,
      answer: newAnswer._id,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnswers(params: IGetAllAnswersParams) {
  try {
    connectToDatabase();

    const { questionId, page = 1, pageSize = 10, sortBy } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .limit(pageSize)
      .skip(skipAmount)
      .sort(sortOptions)
      .populate("author", "_id clerkId name picture");

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteAnswer(params: IAnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery = {};
    if (hasUpVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
      };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
        $push: {
          upvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $push: {
          upvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }
    //   increment user Reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteAnswer(params: IAnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery = {};
    if (hasDownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
      };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
        $push: {
          downvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $push: {
          downvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    //   increment user Reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: IDeleteAnswerProps) {
  try {
    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("No answer found");
    }

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
