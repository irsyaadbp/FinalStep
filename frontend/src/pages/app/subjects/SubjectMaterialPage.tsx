import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ClipboardList,
  Check,
  XCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { subjectService } from "@/service/subject";
import { chapterService } from "@/service/chapter";
import { quizService } from "@/service/quiz";
import { finalExamService } from "@/service/finalExam";
import { progressService } from "@/service/progress";
import { useAsyncFetch } from "@/hooks/useAsyncFetch";
import {
  type Subject,
  type Chapter,
  type Quiz,
  type FinalExam,
} from "@/types/shared";
import { toast } from "sonner";

type ViewMode = "reading" | "quiz" | "finalExam" | "completed";

export default function SubjectMaterialPage() {
  const { slug, materialId } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | FinalExam | null>(null);
  const [finalExam, setFinalExam] = useState<FinalExam | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("reading");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch Subject & Chapters
  const { isLoading: isSubjectLoading } = useAsyncFetch(
    async () => {
      if (!slug) return null;
      return await subjectService.getSubjects();
    },
    {
      onSuccess: (res) => {
        if (res?.data) {
          const found = res.data.find((s) => s.slug === slug);
          setSubject(found || null);
        }
      },
    },
  );

  const { isLoading: isChaptersLoading } = useAsyncFetch(
    async () => {
      if (!slug) return [];
      return await chapterService.getChapters(slug);
    },
    {
      onSuccess: (res) => {
        if (res && "data" in res && res.data) {
          setChapters(res.data);
        }
      },
    },
  );

  // Fetch Final Exam
  const { isLoading: isExamLoading } = useAsyncFetch(
    async () => {
      if (!slug) return null;
      return await finalExamService.getFinalExam(slug);
    },
    {
      onSuccess: (res) => {
        if (res?.data) {
          setFinalExam(res.data);
        }
      },
    },
  );

  // Fetch Active Material (Chapter or Final Exam)
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!slug || !materialId) return;

      // 1. Check if it's a chapter
      const chapter = chapters.find(
        (c) => c.slug === materialId || c._id === materialId,
      );

      if (chapter) {
        setActiveChapter(chapter);
        setViewMode("reading");
        // Fetch Quiz for this chapter
        try {
          const quizRes = await quizService.getQuiz(slug, chapter.slug);
          setActiveQuiz(quizRes.data || null);
        } catch {
          setActiveQuiz(null);
        }
        return;
      }

      // 2. Check if it's the final exam
      if (
        finalExam &&
        (finalExam._id === materialId || finalExam.subjectSlug === materialId)
      ) {
        setActiveQuiz(finalExam);
        setViewMode("finalExam");
        return;
      }

      // 3. If chapters or finalExam not loaded yet, wait for them
      // (The useAsyncFetch will trigger re-renders when they load)
    };

    fetchMaterial();
  }, [slug, materialId, chapters, finalExam]);

  const activeChapterIndex = chapters.findIndex(
    (c) => c.slug === materialId || c._id === materialId,
  );
  const nextChapter = chapters[activeChapterIndex + 1];
  const prevChapter = chapters[activeChapterIndex - 1];

  const handleBackToSyllabus = () => {
    navigate(`/subjects/${slug}`);
  };

  const handleComplete = () => {
    if (activeQuiz && viewMode === "reading" && !quizSubmitted) {
      setViewMode("quiz");
      setQuizAnswers({});
      setQuizSubmitted(false);
      return;
    }
    finishMaterial();
  };

  const finishMaterial = async () => {
    if (!slug) return;

    try {
      if (viewMode === "reading" || viewMode === "quiz") {
        if (activeChapter) {
          await progressService.completeChapter(slug, activeChapter.slug);
          if (activeQuiz && !finalExam) {
            // It was a chapter quiz
            await progressService.completeQuiz(slug, activeQuiz._id);
          }
        }
      } else if (viewMode === "finalExam") {
        await progressService.completeFinalExam(slug);
      }

      await refreshUser();

      toast.success("Materi selesai! 🎉", {
        description:
          viewMode === "finalExam"
            ? "Selamat! Kamu telah menyelesaikan mata pelajaran ini."
            : "+25 XP diperoleh",
      });

      if (nextChapter) {
        navigate(`/subjects/${slug}/material/${nextChapter.slug}`);
        setViewMode("reading");
        setQuizSubmitted(false);
        setQuizAnswers({});
      } else {
        setViewMode("completed");
      }
    } catch {
      toast.error("Gagal menyimpan progress");
    }
  };

  const handleStartFinalExam = () => {
    if (finalExam) {
      navigate(`/subjects/${slug}/material/${finalExam._id}`);
      setViewMode("finalExam");
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      navigate(`/subjects/${slug}/material/${prevChapter.slug}`);
      setViewMode("reading");
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handleQuizSubmit = useCallback(async () => {
    if (!activeQuiz || !slug) return;
    setQuizSubmitted(true);
    const correct = activeQuiz.questions.filter(
      (q) => quizAnswers[q._id || q.id || ""] === q.correctAnswer,
    ).length;
    const total = activeQuiz.questions.length;

    if (viewMode === "finalExam") {
      const passed = correct >= Math.ceil(total * 0.6);
      if (passed) {
        try {
          await progressService.completeFinalExam(slug);
          await refreshUser();
          toast.success(`Lulus! Skor: ${correct}/${total} 🏆`, {
            description: `Selamat! Kamu berhasil menyelesaikan ${subject?.title}!`,
          });
        } catch {
          toast.error("Gagal menyimpan hasil ujian");
        }
      } else {
        toast.error(`Skor: ${correct}/${total} ❌`, {
          description: `Butuh minimal ${Math.ceil(total * 0.6)}/${total} benar. Coba lagi!`,
        });
      }
    } else {
      // Chapter Quiz
      try {
        await progressService.completeQuiz(slug, activeQuiz._id);
        await refreshUser();
        toast.success(`Skor: ${correct}/${total} ✅`, {
          description: `Progress disimpan!`,
        });
      } catch {
        toast.error("Gagal menyimpan hasil quiz");
      }
    }
  }, [activeQuiz, quizAnswers, viewMode, subject, slug, refreshUser]);

  // Timer logic for Final Exam
  useEffect(() => {
    if (viewMode !== "finalExam" || quizSubmitted || timeLeft === null) return;

    if (timeLeft <= 0) {
      setTimeout(() => {
        handleQuizSubmit();
      }, 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, quizSubmitted, timeLeft, handleQuizSubmit]);

  // Initialize timer when entering Final Exam
  useEffect(() => {
    if (viewMode === "finalExam" && finalExam && timeLeft === null) {
      // Use setTimeout to avoid cascading render warning
      const timeout = setTimeout(() => {
        setTimeLeft(finalExam.duration * 60);
      }, 0);
      return () => clearTimeout(timeout);
    } else if (viewMode !== "finalExam" && timeLeft !== null) {
      setTimeout(() => {
        setTimeLeft(null);
      }, 0);
    }
  }, [viewMode, finalExam, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isSubjectLoading || isChaptersLoading || isExamLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject || (!activeChapter && !finalExam)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Materi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {viewMode === "reading" && activeChapter ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto max-w-225 px-4 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="card"
                  size="icon"
                  onClick={handleBackToSyllabus}
                  className="rounded-xl shrink-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>{subject.icon}</span>
                    <span>{subject.title}</span>
                  </p>
                  <h2 className="font-display font-bold text-base truncate mt-0.5">
                    {activeChapter.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((activeChapterIndex + 1) / chapters.length) * 100}%`,
                        }}
                        className="h-full bg-primary rounded-full"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums whitespace-nowrap">
                      {activeChapterIndex + 1} / {chapters.length}
                    </span>
                  </div>
                </div>
              </div>

              <Card className="shadow-card p-6 md:p-8">
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: activeChapter.content }}
                />
              </Card>
            </div>
          </motion.div>
        ) : (viewMode === "quiz" || viewMode === "finalExam") && activeQuiz ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto max-w-225 px-4 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="card"
                  size="icon"
                  onClick={
                    viewMode === "quiz"
                      ? () => setViewMode("reading")
                      : handleBackToSyllabus
                  }
                  className="rounded-xl shrink-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {subject.icon} {subject.title}
                  </p>
                  <h2 className="font-display font-bold text-base truncate">
                    {activeQuiz.title}
                  </h2>
                </div>
                {viewMode === "finalExam" && timeLeft !== null && (
                  <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-xp/10 rounded-xl text-xp font-black tabular-nums text-xs border border-xp/20">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              <Card className="shadow-card p-5 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">
                      {activeQuiz.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeQuiz.questions.length} soal
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  {activeQuiz.questions.map((q, qi) => {
                    const qId = q._id || q.id || `q-${qi}`;
                    return (
                      <div
                        key={qId}
                        className="rounded-xl border-2 border-border p-5"
                      >
                        <p className="font-semibold mb-3 text-sm">
                          {qi + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const selected = quizAnswers[qId] === oi;
                            const isCorrect = oi === q.correctAnswer;
                            let cls = "border-border hover:bg-secondary";
                            if (quizSubmitted) {
                              if (isCorrect)
                                cls = "border-success bg-success/10";
                              else if (selected && !isCorrect)
                                cls = "border-destructive bg-destructive/10";
                            } else if (selected) {
                              cls = "border-primary bg-primary/5";
                            }
                            return (
                              <button
                                key={oi}
                                onClick={() =>
                                  !quizSubmitted &&
                                  setQuizAnswers({ ...quizAnswers, [qId]: oi })
                                }
                                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${cls}`}
                                disabled={quizSubmitted}
                              >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold">
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className="flex-1">{opt}</span>
                                {quizSubmitted && isCorrect && (
                                  <Check className="h-4 w-4 text-success" />
                                )}
                                {quizSubmitted && selected && !isCorrect && (
                                  <XCircle className="h-4 w-4 text-destructive" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </motion.div>
        ) : viewMode === "completed" ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="mx-auto max-w-sm px-4 pt-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-xp/15 text-5xl">
                  🏆
                </div>
              </div>
              <h1 className="font-display text-3xl font-black mb-2">
                Selamat! 🎉
              </h1>
              <p className="text-muted-foreground mb-8 mx-auto max-w-md">
                Kamu telah menyelesaikan semua materi dalam mata pelajaran{" "}
                <span className="font-bold text-foreground">
                  {subject.title}
                </span>
                . Sekarang saatnya menguji kemampuanmu di Ujian Akhir!
              </p>

              <Card className="shadow-card mb-8 p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{finalExam?.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {finalExam?.questions.length} soal • Ambil ujian ini untuk
                      mendapatkan sertifikat dan XP tambahan!
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-3 justify-center">
                <Button
                  size="lg"
                  className="rounded-2xl font-bold h-12 px-8"
                  onClick={handleStartFinalExam}
                >
                  Mulai Ujian Akhir
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl font-bold h-12 px-8"
                  onClick={handleBackToSyllabus}
                >
                  Nanti Saja
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {viewMode !== "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-30"
        >
          <div className="border-t-2 border-border bg-card/95 backdrop-blur-lg">
            <div className="mx-auto max-w-225 flex items-center justify-between px-4 py-4 gap-3">
              {viewMode === "reading" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={handleBackToSyllabus}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Silabus
                  </Button>
                </div>
              ) : viewMode === "quiz" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setViewMode("reading")}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Materi
                </Button>
              ) : (
                // Final Exam Back Button
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-xp/10 rounded-xl text-xp font-black tabular-nums text-xs border border-xp/20">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                  </span>
                </div>
              )}

              {viewMode === "reading" ? (
                <div className="flex gap-4">
                  {prevChapter && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={handlePrevChapter}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                    onClick={handleComplete}
                  >
                    {activeQuiz ? (
                      <>
                        <ClipboardList className="mr-1.5 h-4 w-4" /> Mulai Quiz
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />{" "}
                        {nextChapter ? "Selesai & Lanjut" : "Selesai"}
                      </>
                    )}
                  </Button>
                </div>
              ) : !quizSubmitted ? (
                <Button
                  className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                  onClick={handleQuizSubmit}
                  disabled={
                    !activeQuiz ||
                    Object.keys(quizAnswers).length <
                      activeQuiz.questions.length
                  }
                >
                  Kirim Jawaban
                </Button>
              ) : (
                <Button
                  className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                  onClick={
                    viewMode === "finalExam"
                      ? handleBackToSyllabus
                      : finishMaterial
                  }
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  {viewMode === "finalExam"
                    ? "Selesai"
                    : nextChapter
                      ? "Lanjut"
                      : "Selesai"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
