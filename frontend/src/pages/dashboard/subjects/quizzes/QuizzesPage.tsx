import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Plus, Pencil, Trash2, ChevronLeft, X } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/Dialog";
import { useToast } from "../../../../hooks/useToast";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quizSchema,
  type QuizInput as QuizFormValues,
  type Subject,
  type Chapter,
  type Quiz,
} from "@finalstep/shared";
import { cn } from "../../../../lib/utils";
import { useAsyncFetch } from "../../../../hooks/useAsyncFetch";
import { subjectService } from "../../../../service/subject";
import { chapterService } from "../../../../service/chapter";
import { quizService } from "../../../../service/quiz";

export default function AdminQuizzes() {
  const { slug, materialSlug } = useParams<{
    slug: string;
    materialSlug: string;
  }>();
  const { toast } = useToast();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Fetch subject
  const { execute: fetchSubject } = useAsyncFetch(
    async () => subjectService.getSubject(slug!),
    {
      immediate: false,
      onSuccess: (res) => {
        if (res.data) setSubject(res.data);
      },
    },
  );

  // Fetch chapter
  const { execute: fetchChapter, isLoading: isLoadingChapter } = useAsyncFetch(
    async () => chapterService.getChapter(slug!, materialSlug!),
    {
      immediate: false,
      onSuccess: (res) => {
        if (res.data) setChapter(res.data);
      },
    },
  );

  // Fetch quiz
  const { execute: fetchQuiz, isLoading: isLoadingQuiz } = useAsyncFetch(
    async () => quizService.getQuiz(slug!, materialSlug!),
    {
      immediate: false,
      onSuccess: (res) => {
        if (res.data) setQuiz(res.data);
      },
      onError: () => setQuiz(null),
    },
  );

  useEffect(() => {
    if (slug && materialSlug) {
      fetchSubject();
      fetchChapter();
      fetchQuiz();
    }
  }, [slug, materialSlug, fetchSubject, fetchChapter, fetchQuiz]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [
        {
          id: `q-${Math.random().toString(36).substring(2, 9)}`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  if (!subject || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Memuat data...</p>
        <Link to={`/dashboard/subjects/${slug}/materials`}>
          <Button variant="link">Kembali ke Daftar Materi</Button>
        </Link>
      </div>
    );
  }

  const openCreate = () => {
    reset({
      title: `Quiz ${chapter.title}`,
      questions: [
        {
          id: `q-${Math.random().toString(36).substring(2, 9)}`,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
    setDialogOpen(true);
  };

  const openEdit = () => {
    if (quiz) {
      reset({
        title: quiz.title,
        questions: quiz.questions,
      });
      setDialogOpen(true);
    }
  };

  const onSubmit = async (data: QuizFormValues) => {
    try {
      if (quiz) {
        await quizService.updateQuiz(slug!, materialSlug!, data);
        toast({ title: "Quiz diperbarui", variant: "success" });
      } else {
        await quizService.createQuiz(slug!, materialSlug!, data);
        toast({ title: "Quiz ditambahkan", variant: "success" });
      }
      fetchQuiz();
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await quizService.deleteQuiz(slug!, materialSlug!);
      setDeleteConfirm(false);
      fetchQuiz();
      toast({ title: "Quiz dihapus", variant: "success" });
    } catch (err) {
      console.error(err);
    }
  };

  const watchQuestions = watch("questions");

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/dashboard/subjects/${slug}/materials`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Materi
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>
                {subject.icon} {subject.title}
              </span>
              <span>›</span>
              <span>{chapter.title}</span>
            </div>
            <h1 className="font-display text-2xl font-bold">Quiz</h1>
            <p className="text-muted-foreground text-sm">
              {quiz ? 1 : 0} quiz aktif
            </p>
          </div>
          {!quiz && !isLoadingQuiz && !isLoadingChapter && (
            <Button onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" /> Tambah Quiz
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {quiz ? (
          <Card
            key={quiz._id}
            className="shadow-card"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{quiz.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {quiz.questions.length} pertanyaan
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={openEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeleteConfirm(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
            <p>
              Belum ada quiz untuk materi ini. Klik "Tambah Quiz" untuk memulai.
            </p>
          </div>
        )}
      </div>

      {/* Quiz Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{quiz ? "Edit Quiz" : "Tambah Quiz"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Quiz</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Quiz Limit Fungsi"
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {questionFields.map((field, qi) => (
                <div
                  key={field.id}
                  className="rounded-xl border-2 border-border p-4 space-y-3 relative shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-primary">
                      Pertanyaan {qi + 1}
                    </Label>
                    {questionFields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => removeQuestion(qi)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    {...register(`questions.${qi}.question`)}
                    placeholder="Tulis pertanyaan..."
                    className={cn(
                      "h-11 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(var(--primary)/0.12)] transition-shadow",
                      errors.questions?.[qi]?.question && "border-destructive",
                    )}
                  />
                  {errors.questions?.[qi]?.question && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.questions[qi].question.message}
                    </p>
                  )}

                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((oi) => (
                      <div key={oi} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setValue(`questions.${qi}.correctAnswer`, oi)
                            }
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all ${
                              watchQuestions?.[qi]?.correctAnswer === oi
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.4)]"
                                : "border-border hover:bg-secondary bg-background"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <Input
                            {...register(`questions.${qi}.options.${oi}`)}
                            placeholder={`Opsi ${String.fromCharCode(65 + oi)}`}
                            className={cn(
                              "h-9 rounded-lg border-2 bg-background",
                              errors.questions?.[qi]?.options?.[oi] &&
                                "border-destructive",
                            )}
                          />
                        </div>
                        {errors.questions?.[qi]?.options?.[oi] && (
                          <p className="text-[10px] text-destructive ml-10 font-medium">
                            {errors.questions[qi].options[oi].message}
                          </p>
                        )}
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground mt-1 ml-10">
                      Klik huruf untuk menandai jawaban benar
                    </p>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() =>
                  appendQuestion({
                    id: `q-${Math.random().toString(36).substring(2, 9)}`,
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Tambah Pertanyaan
              </Button>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : quiz ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Quiz?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tindakan ini tidak bisa dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
