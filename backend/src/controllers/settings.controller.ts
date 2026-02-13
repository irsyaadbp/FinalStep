import { Request, Response, NextFunction } from 'express';
import { Settings } from '../models';
import { success, error } from '../utils/response';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      // Create default if missing
      settings = await Settings.create({
        key: 'global',
        examDate: new Date('2026-06-01'), // Default future date
        targetThreshold: 80
      });
    }
    res.json(success('Settings retrieved', settings));
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: 'global' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(success('Settings updated', settings));
  } catch (err) {
    next(err);
  }
};
