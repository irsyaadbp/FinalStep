import { $fetch } from "./$fetch";
import { type ApiResponse, type Chapter, type ChapterInput } from "@/types/shared";

export const chapterService = {
  // Get all chapters for a subject
  getChapters: (subjectSlug: string) => {
    return $fetch<ApiResponse<Chapter[]>>(`/api/subjects/${subjectSlug}/chapters`);
  },

  // Get single chapter
  getChapter: (subjectSlug: string, slug: string) => {
    return $fetch<ApiResponse<Chapter>>(`/api/subjects/${subjectSlug}/chapters/${slug}`);
  },

  // Create chapter (Admin)
  createChapter: (subjectSlug: string, data: ChapterInput & { slug: string; order: number }) => {
    return $fetch<ApiResponse<Chapter>>(`/api/subjects/${subjectSlug}/chapters`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update chapter (Admin)
  updateChapter: (subjectSlug: string, slug: string, data: Partial<ChapterInput & { order: number }>) => {
    return $fetch<ApiResponse<Chapter>>(`/api/subjects/${subjectSlug}/chapters/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete chapter (Admin)
  deleteChapter: (subjectSlug: string, slug: string) => {
    return $fetch<ApiResponse<void>>(`/api/subjects/${subjectSlug}/chapters/${slug}`, {
      method: "DELETE",
    });
  },
};
