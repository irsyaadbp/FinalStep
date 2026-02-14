import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SubjectCard } from "../../components/app/SubjectCard";

import { useNavigate } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Flame,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subjectService } from "@/service/subject";
import { useAsyncFetch } from "@/hooks/useAsyncFetch";
import { type Subject } from "@finalstep/shared";

export default function IndexPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<(Subject & { progress: number })[]>([]);

  useAsyncFetch(
    async () => {
      return await subjectService.getSubjects();
    },
    {
      onSuccess: (res) => {
        if (res.data && user) {
          // Map backend subjects with user progress
          const subjectsWithProgress = res.data.map((s) => {
            const userProgress = user.progress?.find(
              (p) => p.subjectSlug === s.slug
            );
            return {
              ...s,
              id: s._id,
              progress: userProgress?.progressPercent || 0,
            };
          });
          setSubjects(subjectsWithProgress);
        }
      },
    }
  );

  const name = user?.name.split(" ")[0] || "Student";
  const streak = user?.streak || 0;
  const dailyXP = user?.dailyXP || 0;
  const dailyGoal = user?.dailyGoal || 100;
  const isAhead = dailyXP > dailyGoal;
  const isOnTrack = dailyXP > 0;
  
  // Calculate aggregate progress
  const totalChapters = subjects.reduce((acc: number, s) => acc + (s.totalChapters || 0), 0);
  const completedChapters = user?.progress?.reduce((acc: number, p) => acc + (p.completedChapters?.length || 0), 0) || 0;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const lastStudy = user?.lastStudy;
  
  const daysLeft = 12; // This could be dynamic if we have a target date
  const timeProgress = 30; // Dummy for now, or based on time since start



  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-bold truncate">
            Halo, {name || "Student"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Yuk lanjutkan belajarmu!
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-streak/10 border border-streak/20 px-2.5 py-1.5 shrink-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame className="h-4 w-4 text-streak" />
          </motion.div>
          <span className="text-sm font-bold font-display text-streak">
            {streak}
          </span>
        </div>
      </motion.div>

      {/* Focus: Target Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="shadow-card overflow-hidden border-primary/20">
          <CardContent className="p-5">
            {/* Daily XP */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-xp/10">
                  <Zap className="h-4 w-4 text-xp" />
                </div>
                <span className="text-sm font-bold font-display">
                  Target Harian
                </span>
              </div>
              <span className="text-sm font-bold text-xp">
                {dailyXP}/{dailyGoal} XP
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (dailyXP / dailyGoal) * 100)}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-xp shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_2px_0_rgba(0,0,0,0.1)]"
              />
            </div>
            {dailyXP >= dailyGoal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-success mb-3 text-center"
              >
                🎉 Target harian tercapai!
              </motion.p>
            )}

            {/* On-track status */}
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 mb-4">
              {isAhead ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : isOnTrack ? (
                <Target className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-streak shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold font-display">
                  {isAhead
                    ? "Di Atas Target! 🚀"
                    : isOnTrack
                      ? "On Track ✅"
                      : "Perlu Kejar! ⚠️"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>
                    {completedChapters}/{totalChapters} bab
                  </span>
                  <span>·</span>
                  <span>{overallProgress}% selesai</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Calendar className="h-2.5 w-2.5" />
                    {daysLeft} hari lagi
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bars compact */}
            <div className="space-y-1.5">
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Progres Kamu
                  </span>
                  <span className="text-[10px] font-bold text-primary">
                    {overallProgress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Target Ideal
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(timeProgress)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-muted-foreground/20 transition-all"
                    style={{ width: `${timeProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-lg">Progressmu</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2">
          {subjects.map((s, i) => (
            <SubjectCard 
              key={s._id} 
              subject={{
                id: s._id,
                slug: s.slug,
                title: s.title,
                progress: s.progress,
                icon: s.icon
              }} 
              index={i} 
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-24.75 right-0 left-0"
      >
        <Button 
          className="h-[unset]! w-full px-4 py-3"
          onClick={() => {
            if (!lastStudy) {
              navigate(`/subjects`);
            } else {
              const subjectProgress = user?.progress?.find(p => p.subjectSlug === lastStudy.subjectSlug);
              const isExamDone = lastStudy.type === 'final_exam' && subjectProgress?.finalExamDone;

              if (isExamDone) {
                navigate(`/subjects`);
              } else {
                const mid = lastStudy.materialId || lastStudy.chapterSlug;
                if (mid) {
                  navigate(`/subjects/${lastStudy.subjectSlug}/material/${mid}`);
                } else {
                  navigate(`/subjects/${lastStudy.subjectSlug}`);
                }
              }
            }
          }}
        >
          <div className="flex items-center gap-5 w-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15 text-2xl shrink-0">
              {lastStudy ? "📚" : "✨"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-display text-start">
                {lastStudy ? "Lanjutkan Belajar" : "Mulai Belajar"}
              </p>
              <p className="text-xs opacity-80 mt-0.5 line-clamp-1 text-start">
                {lastStudy 
                    ? `${lastStudy.title}` 
                    : "Pilih pelajaran pertamamu!"}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 opacity-70 shrink-0" />
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
