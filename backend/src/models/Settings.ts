import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  examDate: Date;
  targetThreshold: number;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    examDate: { type: Date, required: true },
    targetThreshold: { type: Number, required: true, min: 0, max: 100, default: 80 },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
