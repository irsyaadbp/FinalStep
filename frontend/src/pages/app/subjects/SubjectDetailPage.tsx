import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Play,
  Lock,
  CheckCircle2,
  Trophy,
  BookOpen,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { subjectService } from "@/service/subject";
import { chapterService } from "@/service/chapter";
import { finalExamService } from "@/service/finalExam";
import { useAsyncFetch } from "@/hooks/useAsyncFetch";
import { type Subject, type Chapter, type FinalExam } from "@finalstep/shared";

export default function SubjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subject, setSubject] = useState<(Subject & { progress?: number }) | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [finalExam, setFinalExam] = useState<FinalExam | null>(null);

  useAsyncFetch(
    async () => {
      if (!slug) return null;
      return await subjectService.getSubjects();
    },
    {
      onSuccess: (res) => {
        if (res && 'data' in res && res.data) {
          const found = res.data.find(s => s.slug === slug);
          if (found) {
            const userProgress = user?.progress?.find(p => p.subjectSlug === slug);
            setSubject({ ...found, progress: userProgress?.progressPercent || 0 });
          }
        }
      },
    }
  );

  useAsyncFetch(
    async () => {
      if (!slug) return [];
      return await chapterService.getChapters(slug);
    },
    {
      onSuccess: (res) => {
        if (res && 'data' in res && res.data) {
          setChapters(res.data);
        }
      },
    }
  );

  useAsyncFetch(
    async () => {
      if (!slug) return null;
      return await finalExamService.getFinalExam(slug);
    },
    {
      onSuccess: (res) => {
        if (res && 'data' in res && res.data) {
          setFinalExam(res.data);
        }
      },
    }
  );

  const subjectProgress = user?.progress?.find(p => p.subjectSlug === slug);
  const completedChapters = subjectProgress?.completedChapters || [];
  const isFinalExamPassed = subjectProgress?.finalExamDone || false;

  const chaptersWithStatus = chapters.map((c, i) => {
    const isCompleted = completedChapters.includes(c.slug);
    const isUnlocked = i === 0 || completedChapters.includes(chapters[i-1].slug);
    return {
      ...c,
      id: c._id,
      completed: isCompleted,
      unlocked: isUnlocked
    };
  });

  if (!subject) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Mata pelajaran tidak ditemukan</p>
      </div>
    );
  }

  const completedCount = chaptersWithStatus.filter((c) => c.completed).length;
  const allChaptersCompleted = chapters.length > 0 && completedCount === chapters.length;
  const isFinalExamUnlocked = allChaptersCompleted;

  const openChapter = (index: number) => {
    const ch = chaptersWithStatus[index];
    if (!ch) return;
    if (!ch.unlocked) return;

    navigate(`/subjects/${slug}/material/${ch.slug}`);
  };

  const openFinalExam = () => {
    if (!isFinalExamUnlocked || !finalExam) return;
    navigate(`/subjects/${slug}/material/${finalExam._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="card"
            size="icon"
            onClick={() => navigate('/subjects')}
            className="rounded-xl shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{subject.icon}</span>
              <h1 className="font-display text-xl font-bold truncate">
                {subject.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <Card className="shadow-card mb-6 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Progres Belajar
                </p>
                <p className="text-2xl font-black font-display mt-0.5">
                  {subjectProgress?.progressPercent || 0}%
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-bold">
                  {completedCount}/{chapters.length} Bab
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subjectProgress?.progressPercent || 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
              />
            </div>
          </div>
        </Card>

        {/* Syllabus */}
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold">Silabus Materi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chapters.length} Bab{finalExam ? " + Ujian Akhir" : ""} •{" "}
            {subject.title}
          </p>
        </div>

        <div className="space-y-2 flex-1">
          {chaptersWithStatus.map((ch, i) => {
            const status = ch.completed ? "completed" : ch.unlocked ? "unlocked" : "locked";

            return (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => status !== "locked" && openChapter(i)}
                disabled={status === "locked"}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  status === "locked"
                    ? "border-border bg-secondary/50 opacity-50 cursor-not-allowed"
                    : status === "completed"
                      ? "border-success/20 bg-success/5 hover:bg-success/8 cursor-pointer"
                      : "border-border bg-card hover:border-primary/30 hover:bg-primary/3 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_4px_0_rgba(0,0,0,0.04)]"
                }`}
              >
                <span
                  className={`text-3xl font-black font-display shrink-0 w-10 text-center ${
                    status === "completed"
                      ? "text-success"
                      : status === "locked"
                        ? "text-muted-foreground/30"
                        : "text-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm ${status === "locked" ? "text-muted-foreground/50" : ""}`}
                  >
                    {ch.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Bab {i + 1}
                    </span>
                    {ch.hasQuiz && (
                      <>
                        <span className="text-[10px] text-muted-foreground">
                          •
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <ClipboardList className="h-2.5 w-2.5" /> Quiz
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {status === "completed" ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  ) : status === "locked" ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Lock className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Play className="h-4 w-4 text-primary fill-primary" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}

          {/* Final Exam Item */}
          {finalExam && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapters.length * 0.05 }}
              onClick={() =>
                isFinalExamUnlocked && !isFinalExamPassed && openFinalExam()
              }
              disabled={!isFinalExamUnlocked || isFinalExamPassed}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                isFinalExamPassed
                  ? "border-xp/30 bg-xp/5 cursor-default"
                  : !isFinalExamUnlocked
                    ? "border-border bg-secondary/50 opacity-50 cursor-not-allowed"
                    : "border-xp/30 bg-card hover:border-xp/50 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_4px_0_rgba(0,0,0,0.04)]"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                  isFinalExamPassed
                    ? "bg-xp/15"
                    : !isFinalExamUnlocked
                      ? "bg-muted"
                      : "bg-xp/10"
                }`}
              >
                {isFinalExamPassed ? (
                  <Trophy className="h-5 w-5 text-xp" />
                ) : !isFinalExamUnlocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground/40" />
                ) : (
                  <Trophy className="h-5 w-5 text-xp" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold text-sm ${
                    isFinalExamPassed
                      ? "text-xp"
                      : !isFinalExamUnlocked
                        ? "text-muted-foreground/50"
                        : ""
                  }`}
                >
                  {finalExam.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {isFinalExamPassed
                    ? "🏆 Lulus!"
                    : !isFinalExamUnlocked
                      ? "Selesaikan semua bab terlebih dahulu"
                      : `${finalExam.questions.length} soal • +${finalExam.questions.length * 20} XP`}
                </p>
              </div>
              <div className="shrink-0">
                {isFinalExamPassed ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-xp/10">
                    <CheckCircle2 className="h-5 w-5 text-xp" />
                  </div>
                ) : !isFinalExamUnlocked ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Lock className="h-4 w-4 text-muted-foreground/40" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-xp/10">
                    <Play className="h-4 w-4 text-xp fill-xp" />
                  </div>
                )}
              </div>
            </motion.button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-24.75 right-0 left-0"
      >
        <Button
          className=" w-full px-4 py-3 flex gap-4 justify-between"
          onClick={() => {
            if (subject.progress === 100 && isFinalExamPassed) {
              navigate('/subjects');
            } else {
              const firstIncomplete = chaptersWithStatus.findIndex((c) => !c.completed);
              openChapter(firstIncomplete === -1 ? 0 : firstIncomplete);
            }
          }}
        >
          {subject.progress === 100 && isFinalExamPassed ? (
            <>
              Pilih Mata Pelajaran Lain
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              {completedCount === 0 ? "Mulai Belajar" : "Lanjut Belajar"}
              <Play className="h-4 w-4 fill-current" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
