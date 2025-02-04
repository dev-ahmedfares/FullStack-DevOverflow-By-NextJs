"use server";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ICreateQuestionParams, IGetQuestionById } from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

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

    // TODO create a interaction record for the user's ask question action

    // TODO increment author reputation by +5 points for creating a question

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestions = async () => {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
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

    return question ;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
