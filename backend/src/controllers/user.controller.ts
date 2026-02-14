import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { success } from '../utils/response';


export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json(success('Students retrieved successfully', students));
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = 10;
    const leaderboard = await User.find({ role: 'student' })
      .sort({ xp: -1 })
      .limit(limit)
      .select('name email role school targetUniversity xp level streak avatar');
      
    const totalStudents = await User.countDocuments({ role: 'student' });

    res.status(200).json(success('Leaderboard retrieved successfully', {
      leaderboard,
      totalStudents
    }));
  } catch (err) {
    next(err);
  }
};
