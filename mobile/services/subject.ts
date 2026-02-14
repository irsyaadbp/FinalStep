import { $fetch } from '../lib/$fetch';
import { ApiResponse, Subject } from '../lib/types';

export const subjectService = {
  // Get all subjects
  getSubjects: () => {
    return $fetch<ApiResponse<Subject[]>>('/api/subjects');
  },

  // Get single subject
  getSubject: (slug: string) => {
    return $fetch<ApiResponse<Subject>>(`/api/subjects/${slug}`);
  },
};
