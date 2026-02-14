import { $fetch } from '../lib/$fetch';
import { ApiResponse, Chapter } from '../lib/types';

export const chapterService = {
  // Get all chapters for a subject
  getChapters: (subjectSlug: string) => {
    return $fetch<ApiResponse<Chapter[]>>(`/api/subjects/${subjectSlug}/chapters`);
  },

  // Get single chapter
  getChapter: (subjectSlug: string, slug: string) => {
    return $fetch<ApiResponse<Chapter>>(`/api/subjects/${subjectSlug}/chapters/${slug}`);
  },
};
