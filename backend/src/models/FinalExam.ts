import mongoose, { Document, Schema } from 'mongoose';

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, '{PATH} must have exactly 4 options'],
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
});

export interface IFinalExam extends Document {
  subjectSlug: string;
  title: string;
  duration: number; // in minutes
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FinalExamSchema: Schema = new Schema(
  {
    subjectSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    duration: { type: Number, required: true, default: 60 },
    questions: { type: [QuestionSchema], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFinalExam>('FinalExam', FinalExamSchema);
