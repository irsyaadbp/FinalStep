import mongoose, { Document, Schema } from 'mongoose';

const QuestionSchema = new Schema({
  id: { type: String },
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, '{PATH} must have exactly 4 options'],
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
});

export interface IQuiz extends Document {
  chapterSlug: string;
  subjectSlug: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema(
  {
    chapterSlug: { type: String, required: true, index: true },
    subjectSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
