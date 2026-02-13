import mongoose, { Document, Schema } from 'mongoose';

// Embedded document for last study activity
const LastStudySchema = new Schema({
  subjectSlug: { type: String, required: true },
  chapterSlug: { type: String }, // Nullable if type is not chapter
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' }, // Nullable
  type: {
    type: String,
    enum: ['chapter', 'quiz', 'final_exam'],
    required: true,
  },
  title: { type: String, required: true }, // Display title
  updatedAt: { type: Date, default: Date.now },
});

// Embedded document for subject progress
const ProgressSchema = new Schema({
  subjectSlug: { type: String, required: true },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  completedChapters: [{ type: String }], // Array of chapter slugs
  completedQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }], // Array of Quiz IDs
  finalExamDone: { type: Boolean, default: false },
  lastAccessedAt: { type: Date, default: Date.now },
});

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  school?: string;
  targetUniversity?: string;
  xp: number;
  level: number;
  streak: number;
  dailyXP: number;
  dailyGoal: number;
  lastActiveDate?: Date;
  lastStudy?: {
    subjectSlug: string;
    chapterSlug?: string;
    quizId?: mongoose.Types.ObjectId;
    type: 'chapter' | 'quiz' | 'final_exam';
    title: string;
    updatedAt: Date;
  };
  progress: {
    subjectSlug: string;
    progressPercent: number;
    completedChapters: string[];
    completedQuizzes: mongoose.Types.ObjectId[];
    finalExamDone: boolean;
    lastAccessedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    school: { type: String },
    targetUniversity: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    dailyXP: { type: Number, default: 0 },
    dailyGoal: { type: Number, default: 100 },
    lastActiveDate: { type: Date },
    lastStudy: { type: LastStudySchema },
    progress: [ProgressSchema],
  },
  { timestamps: true }
);

// We will add pre-save hook for password hashing & method for password matching 
// when we implement Auth controller, or better, keep it clean here.
// But typically hashing logic is good inside model middleware.
// For now, assume controller handles hashing or add bcryptjs here.
// Let's add password matching method signature but implementation requires bcryptjs import.
// Since we are writing the model now, let's keep it simple and handle logic later or add it now if easy.
// I'll leave bcrypt import out for now to ensure this file compiles perfectly without waiting for installs, 
// though installs should be done.

export default mongoose.model<IUser>('User', UserSchema);
