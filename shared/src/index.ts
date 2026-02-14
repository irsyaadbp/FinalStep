import { z } from "zod";
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

export const TOKEN_KEY = '@finalstep_token';


export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  school: z.string().min(1, "Asal sekolah harus diisi"),
  targetUniversity: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Subjects
export const subjectSchema = z.object({
  title: z.string().min(1, "Nama pelajaran harus diisi"),
  icon: z.string().min(1),
  color: z.string().min(1),
});

export type SubjectInput = z.infer<typeof subjectSchema>;

export interface Subject {
  _id: string; // Mongoose ID
  slug: string;
  title: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Optional counts for frontend display if aggregated
  totalChapters?: number;
  totalQuizzes?: number;
  completedChapters?: number;
}

// Chapters / Materials
export const chapterSchema = z.object({
  title: z.string().min(1, 'Judul materi harus diisi'),
  content: z.string().optional(),
});

export type ChapterInput = z.infer<typeof chapterSchema>;

export interface Chapter {
  _id: string;
  subjectSlug: string;
  slug: string;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Final Exams / Quizzes
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizSchema = z.object({
  title: z.string().min(1, 'Judul quiz harus diisi'),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string().min(1, 'Pertanyaan harus diisi'),
    options: z.array(z.string().min(1, 'Opsi harus diisi')).length(4),
    correctAnswer: z.number().min(0).max(3),
  })).min(1, 'Minimal 1 pertanyaan'),
});

export type QuizInput = z.infer<typeof quizSchema>;

export interface Quiz {
  _id: string;
  chapterSlug: string;
  subjectSlug: string;
  title: string;
  questions: QuizQuestion[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const finalExamSchema = z.object({
  title: z.string().min(1, 'Judul ujian harus diisi'),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string().min(1, 'Pertanyaan harus diisi'),
    options: z.array(z.string().min(1, 'Opsi harus diisi')).length(4),
    correctAnswer: z.number().min(0).max(3),
  })).min(1, 'Minimal 1 pertanyaan'),
});

export type FinalExamInput = z.infer<typeof finalExamSchema>;

export interface FinalExam {
  _id: string;
  subjectSlug: string;
  title: string;
  questions: QuizQuestion[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { [k: string]: string[] };
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  school?: string;
  targetUniversity?: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  dailyXP: number;
  dailyGoal: number;
  progress: Array<{
    subjectSlug: string;
    progressPercent: number;
    completedChapters: string[];
    completedQuizzes: string[];
    finalExamDone: boolean;
    lastAccessedAt: string;
    _id: string;
  }>;
  lastStudy?: {
    subjectSlug: string;
    chapterSlug: string;
    type: 'chapter' | 'quiz' | 'exam';
    title: string;
    updatedAt: string;
    _id: string;
  };
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  user: UserData;
  token: string;
}

export type AuthResponse = ApiResponse<AuthData>;


