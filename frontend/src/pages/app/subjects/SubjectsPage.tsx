import { useState } from "react";
import { motion } from "motion/react";
import { SubjectCard } from "../../../components/app/SubjectCard";
import { useAuth } from "@/context/AuthContext";
import { subjectService } from "@/service/subject";
import { useAsyncFetch } from "@/hooks/useAsyncFetch";
import { type Subject } from "@finalstep/shared";

export default function SubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<(Subject & { progress: number; completedChapters: number })[]>([]);

  const { isLoading } = useAsyncFetch(
    async () => {
      return await subjectService.getSubjects();
    },
    {
      onSuccess: (res) => {
        if (res.data && user) {
          const subjectsWithProgress = res.data.map((s) => {
            const userProgress = user.progress?.find(
              (p) => p.subjectSlug === s.slug
            );
            return {
              ...s,
              id: s._id,
              progress: userProgress?.progressPercent || 0,
              completedChapters: userProgress?.completedChapters?.length || 0,
            };
          });
          setSubjects(subjectsWithProgress);
        }
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Pelajaran</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subjects.length} mata pelajaran
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        {subjects.map((s, i) => (
          <SubjectCard 
            key={s._id} 
            subject={{
              id: s._id,
              slug: s.slug,
              title: s.title,
              progress: s.progress || 0,
              icon: s.icon,
              totalChapters: s.totalChapters || 0,
              completedChapters: s.completedChapters
            }} 
            index={i} 
          />
        ))}
      </div>
    </div>
  );
}
