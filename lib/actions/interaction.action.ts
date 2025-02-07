"use server";

import { connectToDatabase } from "../mongoose";
import { IViewsQuestionParams } from "./shared.types";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function viewsQuestion(params: IViewsQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId } = params;

    // update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        return console.log("User has already viewed");
      }

      //   Create Interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }

   
  } catch (error) {
    console.log(error);
    throw error;
  }
}
