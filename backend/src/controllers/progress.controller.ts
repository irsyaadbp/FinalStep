import { Request, Response, NextFunction } from "express";
import { User, Chapter, Quiz, FinalExam } from "../models";
import { success, error } from "../utils/response";

// Helper to get or create progress entry for a subject
const getProgressEntry = (user: any, subjectSlug: string) => {
  const entry = user.progress.find((p: any) => p.subjectSlug === subjectSlug);
  if (entry) return entry;

  user.progress.push({
    subjectSlug,
    progressPercent: 0,
    completedChapters: [],
    completedQuizzes: [],
    finalExamDone: false,
    lastAccessedAt: new Date(),
  });
  return user.progress[user.progress.length - 1];
};

export const getProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Return full user progress (or we can filter by subject via query)
    const user = await User.findById((req as any).user?._id).select(
      "progress lastStudy",
    );
    res.json(success("Progress retrieved", user));
  } catch (err) {
    next(err);
  }
};

// Mark Chapter Complete
export const completeChapter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subjectSlug, chapterSlug } = req.body;

    const user = await User.findById((req as any).user?._id);
    if (!user) return res.status(404).json(error("User not found"));

    // Validate chapter exists
    const chapter = await Chapter.findOne({ subjectSlug, slug: chapterSlug });
    if (!chapter) return res.status(404).json(error("Chapter not found"));

    // Update Progress
    const entry = getProgressEntry(user, subjectSlug);
    if (!entry.completedChapters.includes(chapterSlug)) {
      entry.completedChapters.push(chapterSlug);
    }
    entry.lastAccessedAt = new Date();

    // Recalculate percent (simple logic: chapters count vs completed)
    // For real app: count total active chapters in subject
    const totalChapters = await Chapter.countDocuments({
      subjectSlug,
      isActive: true,
    });
    // This simple math ignores quizzes/exams contribution to percent for now
    // or we can assign weights. Let's keep it simple: chapters = 100%?
    // Usually: (completed / total) * 100
    if (totalChapters > 0) {
      entry.progressPercent = Math.round(
        (entry.completedChapters.length / totalChapters) * 100,
      );
    }

    // Update Last Study
    user.lastStudy = {
      subjectSlug,
      chapterSlug,
      type: "chapter",
      title: chapter.title,
      updatedAt: new Date(),
    };

    await user.save();
    res.json(success("Chapter marked complete", { progress: entry }));
  } catch (err) {
    next(err);
  }
};

// Mark Quiz Complete
export const completeQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subjectSlug, quizId } = req.body; // quizId is UUID/ObjectId
    const user = await User.findById((req as any).user?._id);
    if (!user) return res.status(404).json(error("User not found"));

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json(error("Quiz not found"));

    const entry = getProgressEntry(user, subjectSlug);
    if (!entry.completedQuizzes.includes(quizId)) {
      entry.completedQuizzes.push(quizId);
    }
    entry.lastAccessedAt = new Date();

    // Update Last Study
    user.lastStudy = {
      subjectSlug,
      quizId: quiz._id,
      type: "quiz",
      title: quiz.title,
      updatedAt: new Date(),
    };

    await user.save();
    res.json(success("Quiz marked complete", { progress: entry }));
  } catch (err) {
    next(err);
  }
};

// Mark Final Exam Complete
export const completeFinalExam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subjectSlug } = req.body;
    const user = await User.findById((req as any).user?._id);
    if (!user) return res.status(404).json(error("User not found"));

    const exam = await FinalExam.findOne({ subjectSlug, isActive: true });
    if (!exam) return res.status(404).json(error("Exam not found"));

    const entry = getProgressEntry(user, subjectSlug);
    entry.finalExamDone = true;
    entry.lastAccessedAt = new Date();

    // If exam passed, maybe max out progress?
    entry.progressPercent = 100;

    user.lastStudy = {
      subjectSlug,
      type: "final_exam",
      title: exam.title,
      updatedAt: new Date(),
    };

    await user.save();
    res.json(success("Final Exam completed", { progress: entry }));
  } catch (err) {
    next(err);
  }
};
