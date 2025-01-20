import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface ICreateQuestionParams {
  title: string;
  content: string;
  author: Schema.Types.ObjectId | IUser;
  tags: string[];
  path: string;
}

// export interface IGetQuestionsParams {
//   page_size:
// }

export interface ICreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}
