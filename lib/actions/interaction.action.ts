"use server";

import { connectToDatabase } from "../mongoose";
import { IViewsQuestionParams } from "./shared.types";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";
import { getErrorMessage } from "../utils";

export async function viewsQuestion(params: IViewsQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId } = params;

    // update view count for the question
   const question=  await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
        tags:question.tags
      });

      if (existingInteraction) {
        return console.log("User has already viewed");
      }

      //   Create Interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
        tags:question.tags
      });
    }

   
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
