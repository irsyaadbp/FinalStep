import mongoose, { Document, Schema } from 'mongoose';

export interface IChapter extends Document {
  subjectSlug: string;
  slug: string;
  title: string;
  content: string; // HTML content (sanitized before save)
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema: Schema = new Schema(
  {
    subjectSlug: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound unique index for slug within a subject
ChapterSchema.index({ subjectSlug: 1, slug: 1 }, { unique: true });

export default mongoose.model<IChapter>('Chapter', ChapterSchema);
