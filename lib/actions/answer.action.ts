"use server";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { ICreateAnswerProps, IGetAllAnswersParams } from "./shared.types";
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


    return {answers}
  } catch (error) {
    console.log(error);
    throw error;
  }
}
