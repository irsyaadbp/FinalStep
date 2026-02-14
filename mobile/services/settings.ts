import { $fetch } from '@/lib/$fetch';
import { ApiResponse, Settings } from '@/lib/types';

export const settingsService = {
  getSettings: async () => {
    return await $fetch<ApiResponse<Settings>>('/api/settings');
  },
};
