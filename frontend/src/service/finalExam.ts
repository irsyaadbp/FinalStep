import { $fetch } from "./$fetch";
import { type ApiResponse, type FinalExam, type FinalExamInput } from "@finalstep/shared";

export const finalExamService = {
  // Get final exam for a subject
  getFinalExam: (subjectSlug: string) => {
    return $fetch<ApiResponse<FinalExam>>(`/api/subjects/${subjectSlug}/final-exam`);
  },

  // Create final exam (Admin)
  createFinalExam: (subjectSlug: string, data: FinalExamInput) => {
    return $fetch<ApiResponse<FinalExam>>(`/api/subjects/${subjectSlug}/final-exam`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update final exam (Admin)
  updateFinalExam: (subjectSlug: string, data: Partial<FinalExamInput>) => {
    return $fetch<ApiResponse<FinalExam>>(`/api/subjects/${subjectSlug}/final-exam`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete final exam (Admin)
  deleteFinalExam: (subjectSlug: string) => {
    return $fetch<ApiResponse<void>>(`/api/subjects/${subjectSlug}/final-exam`, {
      method: "DELETE",
    });
  },
};
