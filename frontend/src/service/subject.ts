import { $fetch } from "./$fetch";
import { type ApiResponse, type Subject, type SubjectInput } from "@finalstep/shared";

export const subjectService = {
  // Get all subjects
  getSubjects: () => {
    return $fetch<ApiResponse<Subject[]>>("/api/subjects");
  },

  // Get single subject
  getSubject: (slug: string) => {
    return $fetch<ApiResponse<Subject>>(`/api/subjects/${slug}`);
  },

  // Create subject (Admin)
  createSubject: (data: SubjectInput) => {
    return $fetch<ApiResponse<Subject>>("/api/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update subject (Admin)
  updateSubject: (slug: string, data: Partial<SubjectInput>) => {
    return $fetch<ApiResponse<Subject>>(`/api/subjects/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete subject (Admin)
  deleteSubject: (slug: string) => {
    return $fetch<ApiResponse<void>>(`/api/subjects/${slug}`, {
      method: "DELETE",
    });
  },
};
