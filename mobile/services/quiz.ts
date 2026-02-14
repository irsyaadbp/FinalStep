import { $fetch } from '../lib/$fetch';
import { ApiResponse, Quiz } from '../lib/types';

export const quizService = {
  getQuiz: (subjectSlug: string, chapterSlug: string) => {
    return $fetch<ApiResponse<Quiz>>(`/api/subjects/${subjectSlug}/chapters/${chapterSlug}/quiz`);
  },
};
