import { $fetch } from "./$fetch";
import { type ApiResponse } from "@finalstep/shared";
import { type Student } from "./user";

export interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  totalChapters: number;
  totalQuizzes: number;
  leaderboard: Student[];
}

export const dashboardService = {
  getStats: () => {
    return $fetch<ApiResponse<DashboardStats>>("/api/dashboard");
  },
};
