import { $fetch } from "./$fetch";
import { type ApiResponse } from "@/types/shared";

export interface Settings {
  key: string;
  examDate: string;
  targetThreshold: number;
}

export const settingsService = {
  getSettings: () => {
    return $fetch<ApiResponse<Settings>>("/api/settings");
  },
  updateSettings: (data: Partial<Settings>) => {
    return $fetch<ApiResponse<Settings>>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
