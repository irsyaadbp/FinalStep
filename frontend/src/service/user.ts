import { $fetch } from "./$fetch";
import { type ApiResponse } from "@/types/shared";
import { type UserData } from "@/types/shared";

export interface Student extends Omit<UserData, 'progress'> {
  xp: number;
  level: number;
  streak: number;
  progress: number;
}

export const userService = {
  getStudents: () => {
    return $fetch<ApiResponse<Student[]>>("/api/users/students");
  },
  getLeaderboard: () => {
    return $fetch<ApiResponse<{ leaderboard: Student[], totalStudents: number }>>("/api/users/leaderboard");
  },
};
