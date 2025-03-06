"use server";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateQuestionParams,
  IDeleteQuestionProps,
  IEditQuestion,
  IGetQuestionById,
  IGetQuestionsParams,
  IVoteQuestionParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import path from "path";

export const createQuestion = async (params: ICreateQuestionParams) => {
  try {
    // TO Connect to database
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create a new question
    const question = await Question.create({
      title,
      content,
      author,
    });

    // Tags Documents array
    const tagsDocuments = [];

    // create tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        // TO search for this tag exist or not
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        // To update this tag and add question id to it in tag Document
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        // if this tag not existing it add it or create new document for it
        {
          upsert: true,
          new: true,
        },
      );
      tagsDocuments.push(existingTag._id);
    }

    // To add Tags id array to related question in DB
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagsDocuments } },
    });

    //  create a interaction record for the user's ask question action
    await Interaction.create({
      user: author,
      question: question._id,
      action: "ask-question",
      tags: tagsDocuments,
    });

    //  increment author reputation by +5 points for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestions = async (params: IGetQuestionsParams) => {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;

      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionById = async ({ questionId }: IGetQuestionById) => {
  try {
    connectToDatabase();

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upVoteQuestion = async (params: IVoteQuestionParams) => {
  try {
    connectToDatabase();

    const { questionId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery = {};

    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("No question found");
    }

    //  add reputation for user points +/-
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downVoteQuestion = async (params: IVoteQuestionParams) => {
  try {
    connectToDatabase();

    const { questionId, hasDownVoted, hasUpVoted, userId, path } = params;

    let updateQuery = {};

    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const questionObject = await Question.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true },
    );

    //  add reputation for user points +/-
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(questionObject.author, {
      $inc: { reputation: hasDownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function deleteQuestion(params: IDeleteQuestionProps) {
  try {
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { questions: questionId } },
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: IEditQuestion) {
  try {
    connectToDatabase();
    const { path, questionId, title, content } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("No question found ");
    }

    question.title = title;
    question.content = content;
    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopQuestions() {
  try {
    connectToDatabase();

    const topQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return topQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
