"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  IGetAllTagsParams,
  IGetQuestionsByTagId,
  IGetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import { getErrorMessage } from "../utils";
import Interaction from "@/database/interaction.model";


export async function getTopInteractedTags(
  params: IGetTopInteractedTagsParams,
) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interactions for the user and group by tags
    const tagCountMap = await Interaction.aggregate([
      { $match: { user: user._id, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const topTags = tagCountMap.map((tagCount) => tagCount._id);

    // find the tag documents for the top tags
    const topTagDocuments = await Tag.find({ _id: { $in: topTags } });
    return topTagDocuments;

  } catch (error) {
    console.log(error);
    // return { error: getErrorMessage(error) };
    return [];
  }
}

export async function getAllTags(params: IGetAllTagsParams) {
  try {
    connectToDatabase();
    const { filter, searchQuery, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getQuestionsByTagId(params: IGetQuestionsByTagId) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, "i") } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize + 1,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.questions;

    const isNext = questions.length > pageSize;

    return {
      tagTitle: tag.name,
      questions: questions.slice(0, pageSize),
      isNext,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const TopPopularTags = await Tag.aggregate([
      {
        $project: { name: 1, numberOfQuestions: { $size: "$questions" } },
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 10 },
    ]);

    return TopPopularTags;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
