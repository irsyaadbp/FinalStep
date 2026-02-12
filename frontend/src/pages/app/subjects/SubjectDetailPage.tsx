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
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { subjects, allChapters, quizzes, finalExams } from "./data";
import { Button } from "../../../components/ui/Button";

export default function SubjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const subject = subjects.find((s) => s.slug === slug);
  const subjectId = subject?.id;

  // Local state for tracking completion (reset on reload obviously)
  const [localCompletedChapters] = useState<string[]>(
    allChapters.filter((c) => c.completed).map((c) => c.id),
  );
  // We need localPassedExams to know if the exam is passed, to show the checkmark/status
  const [localPassedExams] = useState<string[]>([]);

  const chapters = allChapters
    .filter((c) => c.subjectId === subjectId)
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      ...c,
      completed: localCompletedChapters.includes(c.id),
    }));

  const finalExam = finalExams.find((fe) => fe.subjectId === subjectId);
  if (finalExam) {
    finalExam.passed = !!subjectId && localPassedExams.includes(subjectId);
  }

  if (!subject) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Mata pelajaran tidak ditemukan</p>
      </div>
    );
  }

  const completedCount = chapters.filter((c) => c.completed).length;
  const allChaptersCompleted = completedCount === chapters.length;
  const isFinalExamUnlocked = allChaptersCompleted;
  const isFinalExamPassed = finalExam?.passed ?? false;

  const openChapter = (index: number) => {
    const ch = chapters[index];
    if (!ch) return;
    const isUnlocked = index === 0 || chapters[index - 1]?.completed;
    if (!isUnlocked) return;

    navigate(`/subjects/${slug}/material/${ch.id}`);
  };

  const openFinalExam = () => {
    if (!isFinalExamUnlocked || !finalExam) return;
    navigate(`/subjects/${slug}/material/${finalExam.id}`);
  };

  const getChapterStatus = (index: number) => {
    const ch = chapters[index];
    if (ch.completed) return "completed";
    if (index === 0 || chapters[index - 1]?.completed) return "unlocked";
    return "locked";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_4px_0_rgba(0,0,0,0.04)] hover:bg-secondary transition-colors shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
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
                  {subject.progress}%
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
                animate={{ width: `${subject.progress}%` }}
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
          {chapters.map((ch, i) => {
            const status = getChapterStatus(i);
            const hasQuiz = quizzes.some((q) => q.chapterId === ch.id);

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
                    {hasQuiz && (
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
            const firstIncomplete = chapters.findIndex((c) => !c.completed);
            openChapter(firstIncomplete === -1 ? 0 : firstIncomplete);
          }}
        >
          {completedCount === 0 ? "Mulai Belajar" : "Lanjut Belajar"}
          <Play className="h-4 w-4 fill-current" />
        </Button>
      </motion.div>
    </div>
  );
}
