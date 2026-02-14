import { $fetch } from '../lib/$fetch';
import { ApiResponse } from '../lib/types';

export const progressService = {
  completeChapter: (subjectSlug: string, chapterSlug: string) => {
    return $fetch<ApiResponse>('/api/progress/chapter', {
      method: 'POST',
      body: { subjectSlug, chapterSlug },
    });
  },
  completeQuiz: (subjectSlug: string, quizId: string) => {
    return $fetch<ApiResponse>('/api/progress/quiz', {
      method: 'POST',
      body: { subjectSlug, quizId },
    });
  },
  completeFinalExam: (subjectSlug: string) => {
    return $fetch<ApiResponse>('/api/progress/final-exam', {
      method: 'POST',
      body: { subjectSlug },
    });
  },
};
