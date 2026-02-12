import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ClipboardList,
  Check,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { subjects, allChapters, quizzes, finalExams } from "./data";

type ViewMode = "reading" | "quiz" | "finalExam";

const useToast = () => {
  return {
    toast: (props: unknown) => console.log("Toast:", props),
  };
};

const useUserStore = () => {
  return {
    addXP: (amount: number) => console.log(`Added ${amount} XP`),
  };
};

export default function SubjectMaterialPage() {
  const { slug, materialId } = useParams();
  const navigate = useNavigate();

  const subject = subjects.find((s) => s.slug === slug);
  const subjectId = subject?.id;

  // Check if it's a normal chapter
  const chapter = allChapters.find(
    (c) => c.id === materialId && c.subjectId === subjectId,
  );

  // Check if it's a final exam
  const finalExam = finalExams.find(
    (fe) => fe.id === materialId && fe.subjectId === subjectId,
  );

  // Determine initial view mode
  const [viewMode, setViewMode] = useState<ViewMode>(
    finalExam ? "finalExam" : "reading",
  );
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Local state for tracking completion
  const [localCompletedChapters, setLocalCompletedChapters] = useState<
    string[]
  >(allChapters.filter((c) => c.completed).map((c) => c.id));
  const [localPassedExams, setLocalPassedExams] = useState<string[]>([]);

  const { toast } = useToast();
  const { addXP } = useUserStore();

  const completeChapter = (_: string, chapterId: string) => {
    if (!localCompletedChapters.includes(chapterId)) {
      setLocalCompletedChapters([...localCompletedChapters, chapterId]);
    }
  };

  const passFinalExam = (subjectId: string) => {
    if (!localPassedExams.includes(subjectId)) {
      setLocalPassedExams([...localPassedExams, subjectId]);
    }
  };

  const currentChapters = allChapters
    .filter((c) => c.subjectId === subjectId)
    .sort((a, b) => a.order - b.order);

  const activeChapterIndex = currentChapters.findIndex(
    (c) => c.id === materialId,
  );
  const nextChapter = currentChapters[activeChapterIndex + 1];

  if (!subject || (!chapter && !finalExam)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Materi tidak ditemukan</p>
      </div>
    );
  }

  const chapterQuiz = chapter
    ? quizzes.find((q) => q.chapterId === chapter.id)
    : null;

  // Use finalExam if available, otherwise chapterQuiz
  const activeQuiz = finalExam || chapterQuiz;

  const handleBackToSyllabus = () => {
    navigate(`/subjects/${slug}`);
  };

  const handleComplete = () => {
    if (chapterQuiz && !quizSubmitted) {
      setViewMode("quiz");
      setQuizAnswers({});
      setQuizSubmitted(false);
      return;
    }
    finishChapter();
  };

  const finishChapter = () => {
    if (!chapter) return;
    completeChapter(subject.id, chapter.id);
    addXP(25);
    toast({
      variant: "success",
      title: "Bab selesai! 🎉",
      description: "+25 XP diperoleh",
    });

    if (nextChapter) {
      navigate(`/subjects/${slug}/material/${nextChapter.id}`);
      setViewMode("reading");
      setQuizSubmitted(false);
      setQuizAnswers({});
    } else {
      navigate(`/subjects/${slug}`);
    }
  };

  const handleQuizSubmit = () => {
    if (!activeQuiz) return;
    setQuizSubmitted(true);
    const correct = activeQuiz.questions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer,
    ).length;
    const total = activeQuiz.questions.length;
    
    // Different logic for Chapter Quiz vs Final Exam
    if (viewMode === "finalExam") {
        const bonus = correct * 20;
        const passed = correct >= Math.ceil(total * 0.6);
        addXP(bonus);

        if (passed) {
            passFinalExam(subject.id);
            toast({
                variant: "success",
                title: `Lulus! Skor: ${correct}/${total} 🏆`,
                description: `+${bonus} XP! Kamu berhasil menyelesaikan ${subject.title}!`,
            });
        } else {
            toast({
                variant: "destructive",
                title: `Skor: ${correct}/${total} ❌`,
                description: `Butuh minimal ${Math.ceil(total * 0.6)}/${total} benar. Coba lagi!`,
            });
        }
    } else {
        // Chapter Quiz
        const bonus = correct * 10;
        addXP(bonus);
        toast({
            variant: "success",
            title: `Skor: ${correct}/${total} ✅`,
            description: `+${bonus} XP bonus dari quiz!`,
        });
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {viewMode === "reading" && chapter ? (
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
                  <p className="text-xs text-muted-foreground">
                    {subject.icon} {subject.title}
                  </p>
                  <h2 className="font-display font-bold text-base truncate">
                    {chapter.title}
                  </h2>
                </div>
                <span className="text-xs font-bold text-muted-foreground shrink-0 rounded-full bg-secondary px-3 py-1">
                  {activeChapterIndex + 1}/{currentChapters.length}
                </span>
              </div>

              <Card className="shadow-card p-6 md:p-8">
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
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
                  onClick={viewMode === "quiz" ? () => setViewMode("reading") : handleBackToSyllabus}
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
                  {activeQuiz.questions.map((q, qi) => (
                    <div
                      key={q.id}
                      className="rounded-xl border-2 border-border p-5"
                    >
                      <p className="font-semibold mb-3 text-sm">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          const selected = quizAnswers[q.id] === oi;
                          const isCorrect = oi === q.correctAnswer;
                          let cls = "border-border hover:bg-secondary";
                          if (quizSubmitted) {
                            if (isCorrect) cls = "border-success bg-success/10";
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
                                setQuizAnswers({ ...quizAnswers, [q.id]: oi })
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
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-30"
      >
        <div className="border-t-2 border-border bg-card/95 backdrop-blur-lg">
          <div className="mx-auto max-w-225 flex items-center justify-between px-4 py-4 gap-3">
            {viewMode === "reading" ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={handleBackToSyllabus}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Silabus
              </Button>
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
                <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={handleBackToSyllabus}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Keluar
              </Button>
            )}

            {viewMode === "reading" ? (
              <Button
                className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                onClick={handleComplete}
              >
                {chapterQuiz ? (
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
            ) : !quizSubmitted ? (
              <Button
                className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                onClick={handleQuizSubmit}
                disabled={
                  !activeQuiz ||
                  Object.keys(quizAnswers).length < activeQuiz.questions.length
                }
              >
                Kirim Jawaban
              </Button>
            ) : (
              <Button
                className="rounded-xl flex-1 max-w-50 h-10 font-bold"
                onClick={viewMode === "finalExam" ? handleBackToSyllabus : finishChapter}
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                {viewMode === "finalExam" 
                    ? "Selesai" 
                    : nextChapter ? "Lanjut" : "Selesai"}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
