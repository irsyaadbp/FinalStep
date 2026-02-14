import { $fetch } from "./$fetch";
import { type ApiResponse } from "@/types/shared";

export const progressService = {
  completeChapter: (subjectSlug: string, chapterSlug: string) => {
    return $fetch<ApiResponse>(`/api/progress/chapter`, {
      method: "POST",
      body: JSON.stringify({ subjectSlug, chapterSlug }),
    });
  },
  completeQuiz: (subjectSlug: string, quizId: string) => {
    return $fetch<ApiResponse>(`/api/progress/quiz`, {
      method: "POST",
      body: JSON.stringify({ subjectSlug, quizId }),
    });
  },
  completeFinalExam: (subjectSlug: string) => {
    return $fetch<ApiResponse>(`/api/progress/final-exam`, {
      method: "POST",
      body: JSON.stringify({ subjectSlug }),
    });
  },
};
