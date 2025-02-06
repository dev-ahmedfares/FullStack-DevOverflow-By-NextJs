"use server";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  IAnswerVoteParams,
  ICreateAnswerProps,
  IGetAllAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO : ADD Interactions

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

    const answers = await Answer.find({ question: questionId }).populate(
      "author",
      "_id clerkId name picture",
    );

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteAnswer(params: IAnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery;
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
      throw new Error("Answer not found")
    }
    //  TODO increment user Reputation
    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteAnswer(params: IAnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery;
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
      throw new Error("Answer not found")
    }
    //  TODO increment user Reputation
    
    revalidatePath(path)
  } catch (error) {
    console.log(error);
    throw error;
  }
}
