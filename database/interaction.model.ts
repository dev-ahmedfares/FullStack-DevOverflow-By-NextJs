import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  action: string;
  user: Schema.Types.ObjectId; // Reference to user
  question: Schema.Types.ObjectId; // Reference to question
  answer: Schema.Types.ObjectId; // Reference to answer
  tags: Schema.Types.ObjectId[]; // Reference to tags
  createdAt: Date;
}

const interactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", interactionSchema);

export default Interaction;
