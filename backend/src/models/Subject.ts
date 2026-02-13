import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  slug: string;
  title: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true }, // Hex color e.g. #3B82F6
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);
