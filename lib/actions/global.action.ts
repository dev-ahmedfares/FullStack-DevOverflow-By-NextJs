"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { IGlobalSearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import { getErrorMessage } from "../utils";

export async function globalSearch(params: IGlobalSearchParams) {
  try {
    connectToDatabase();
    const { query, type } = params;

    const searchableType = ["question", "answer", "user", "tag"];
    const regexQuery = { $regex: query, $options: "i" };

    const results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    // typeLower and check by searchable for safety if any one change type from client side
    const typeLower = type?.toLowerCase();
    if (!typeLower || !searchableType.includes(typeLower)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          })),
        );
      }
    } else {
      // Search in specific model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results.push(
        ...queryResults.map((item) => ({
          title:
            type === "answer"
              ? `Answers containing ${query}`
              : item[modelInfo.searchField],
          type,
          id:
            type === "user"
              ? item.clerkId
              : type === "answer"
                ? item.question
                : item._id,
        })),
      );
    }

    return JSON.stringify(results);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
