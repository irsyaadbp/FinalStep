import { Request, Response, NextFunction } from 'express';
import { User, Subject, Chapter, Quiz } from '../models';
import { success } from '../utils/response';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSubjects = await Subject.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    const leaderboard = await User.find({ role: 'student' })
      .sort({ xp: -1 })
      .limit(5)
      .select('name email role school targetUniversity xp level streak avatar');

    res.status(200).json(success('Dashboard stats retrieved successfully', {
      totalStudents,
      totalSubjects,
      totalChapters,
      totalQuizzes,
      leaderboard
    }));
  } catch (err) {
    next(err);
  }
};
