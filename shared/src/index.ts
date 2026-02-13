import { z } from "zod";

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

// Chapters / Materials
export const chapterSchema = z.object({
  title: z.string().min(1, 'Judul materi harus diisi'),
  content: z.string().optional(),
});

export type ChapterInput = z.infer<typeof chapterSchema>;

// Final Exams / Quizzes
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
