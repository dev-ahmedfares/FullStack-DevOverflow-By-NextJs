import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface ICreateQuestionParams {
  title: string;
  content: string;
  author: Schema.Types.ObjectId | IUser;
  tags: string[];
  path: string;
}

export interface ICreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface IUpdateUserParams {
  clerkId: string;
  userData: {
    name: string;
    username: string;
    email: string;
    picture: string;
  };
  path: string;
}

export interface IGetAllUsersParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface IGetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

export interface IGetAllTagsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface IGetQuestionById {
  questionId: string;
}

export interface ICreateAnswerProps {
  content: string;
  author: string; // User ID
  question: string; // QuestionID
  path: string;
}

export interface IGetAllAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
