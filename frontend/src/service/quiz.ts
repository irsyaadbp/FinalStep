import { $fetch } from './$fetch';
import { type Quiz, type QuizInput, type ApiResponse } from '@/types/shared';

export const quizService = {
  getQuiz: (subjectSlug: string, chapterSlug: string) => {
    return $fetch<ApiResponse<Quiz>>(`/api/subjects/${subjectSlug}/chapters/${chapterSlug}/quiz`);
  },

  createQuiz: (subjectSlug: string, chapterSlug: string, data: QuizInput) => {
    return $fetch<ApiResponse<Quiz>>(`/api/subjects/${subjectSlug}/chapters/${chapterSlug}/quiz`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateQuiz: (subjectSlug: string, chapterSlug: string, data: QuizInput) => {
    return $fetch<ApiResponse<Quiz>>(`/api/subjects/${subjectSlug}/chapters/${chapterSlug}/quiz`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteQuiz: (subjectSlug: string, chapterSlug: string) => {
    return $fetch<ApiResponse<null>>(`/api/subjects/${subjectSlug}/chapters/${chapterSlug}/quiz`, {
      method: 'DELETE',
    });
  },
};
