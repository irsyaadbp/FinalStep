import { $fetch } from '../lib/$fetch';
import { ApiResponse, FinalExam } from '../lib/types';

export const finalExamService = {
  getFinalExam: (subjectSlug: string) => {
    return $fetch<ApiResponse<FinalExam>>(`/api/subjects/${subjectSlug}/final-exam`);
  },
};
