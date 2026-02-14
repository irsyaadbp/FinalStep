import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ClipboardList,
  ClipboardPlus,
  Trophy,
  X,
} from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { Textarea } from "../../../../components/ui/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/Dialog";
import { Badge } from "../../../../components/ui/Badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/Tooltip";
import { useToast } from "../../../../hooks/useToast";
import { cn } from "../../../../lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chapterSchema,
  finalExamSchema,
  type Chapter,
  type FinalExam,
  type ChapterInput as ChapterFormValues,
  type FinalExamInput as FinalExamFormValues,
  type Subject,
} from "@finalstep/shared";
import {
  FormGenerator,
  type FormField,
} from "../../../../components/common/FormGenerator";
import { useAsyncFetch } from "../../../../hooks/useAsyncFetch";
import { subjectService } from "../../../../service/subject";
import { chapterService } from "../../../../service/chapter";
import { finalExamService } from "../../../../service/finalExam";

export default function MaterialsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [finalExam, setFinalExam] = useState<FinalExam | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  // Fetch chapters
  const { execute: fetchChapters } = useAsyncFetch(
    async () => chapterService.getChapters(slug!),
    {
      immediate: false,
      onSuccess: (res) => {
        if (res.data) setChapters(res.data);
      },
    },
  );

  // Fetch final exam
  const { execute: fetchFinalExam } = useAsyncFetch(
    async () => finalExamService.getFinalExam(slug!),
    {
      immediate: false,
      onSuccess: (res) => {
        if (res.data) setFinalExam(res.data);
      },
      onError: () => setFinalExam(null),
    },
  );

  useEffect(() => {
    if (slug) {
      fetchSubject();
      fetchChapters();
      fetchFinalExam();
    }
  }, [slug, fetchSubject, fetchChapters, fetchFinalExam]);

  // Chapter react-hook-form
  const {
    register: registerChapter,
    handleSubmit: handleSubmitChapter,
    formState: { errors: errorsChapter, isSubmitting: isSubmittingChapter },
    reset: resetChapter,
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { title: "", content: "" },
  });

  const chapterFields: FormField<ChapterFormValues>[] = [
    {
      id: "title",
      label: "Judul Materi",
      placeholder: "Limit Fungsi",
      required: true,
    },
    {
      id: "content",
      label: "Konten (HTML)",
      placeholder: "<h2>Judul</h2><p>Konten materi...</p>",
      render: ({ field, register, errors }) => (
        <Textarea
          id={field.id}
          {...register(field.id)}
          placeholder={field.placeholder}
          className={cn(
            "min-h-[200px] rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(var(--primary)/0.12)] transition-shadow text-sm",
            errors[field.id] && "border-destructive",
          )}
          rows={8}
        />
      ),
    },
  ];

  // Final exam react-hook-form
  const {
    register: registerExam,
    handleSubmit: handleSubmitExam,
    formState: { errors: errorsExam, isSubmitting: isSubmittingExam },
    reset: resetExam,
    control: controlExam,
  } = useForm<FinalExamFormValues>({
    resolver: zodResolver(finalExamSchema),
    defaultValues: { title: "", questions: [] },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: controlExam,
    name: "questions",
  });

  const examFields: FormField<FinalExamFormValues>[] = [
    {
      id: "title",
      label: "Judul Ujian",
      placeholder: "Ujian Akhir Matematika",
      required: true,
    },
    {
      id: "questions",
      label: "Soal-soal",
      render: () => (
        <div className="space-y-4">
          <Label>Soal-soal</Label>
          {questionFields.map((q, qi) => (
            <Card key={q.id} className="p-4 space-y-3 shadow-sm border-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground shrink-0 mt-2">
                  #{qi + 1}
                </span>
                <div className="flex-1 space-y-1">
                  <Input
                    className={cn(
                      "h-11 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(var(--primary)/0.12)] transition-shadow text-sm",
                      errorsExam.questions?.[qi]?.question &&
                        "border-destructive",
                    )}
                    {...registerExam(`questions.${qi}.question`)}
                    placeholder="Tulis pertanyaan..."
                  />
                  {errorsExam.questions?.[qi]?.question && (
                    <p className="text-xs text-destructive font-medium">
                      {errorsExam.questions[qi]?.question?.message}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-destructive"
                  onClick={() => removeQuestion(qi)}
                  disabled={questionFields.length <= 1}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pl-8">
                {[0, 1, 2, 3].map((oi) => (
                  <div key={oi} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={oi}
                        {...registerExam(`questions.${qi}.correctAnswer`, {
                          valueAsNumber: true,
                        })}
                        className="accent-primary"
                      />
                      <Input
                        {...registerExam(`questions.${qi}.options.${oi}`)}
                        placeholder={`Opsi ${String.fromCharCode(65 + oi)}`}
                        className={cn(
                          "text-sm h-9 rounded-lg border-2 bg-background",
                          errorsExam.questions?.[qi]?.options?.[oi] &&
                            "border-destructive",
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pl-8">
                Pilih radio button untuk menandai jawaban benar
              </p>
            </Card>
          ))}
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={() =>
              appendQuestion({
                id: `fq-${Math.random().toString(36).substring(2, 9)}`,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
              })
            }
            className="w-full"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Tambah Soal
          </Button>
        </div>
      ),
    },
  ];

  // Final exam state
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [deleteExamConfirm, setDeleteExamConfirm] = useState(false);

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Memuat data pelajaran...</p>
        <Link to="/dashboard/subjects">
          <Button variant="link">Kembali ke Daftar Pelajaran</Button>
        </Link>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    resetChapter({ title: "", content: "" });
    setDialogOpen(true);
  };

  const openEdit = (ch: Chapter) => {
    setEditing(ch);
    resetChapter({ title: ch.title, content: ch.content });
    setDialogOpen(true);
  };

  const handleSaveChapter = async (data: ChapterFormValues) => {
    try {
      if (editing) {
        await chapterService.updateChapter(slug!, editing.slug, data);
        toast({ title: "Materi diperbarui", variant: "success" });
      } else {
        const genSlug = data.title.toLowerCase().replace(/\s+/g, "-");
        await chapterService.createChapter(slug!, {
          ...data,
          slug: genSlug,
          order: chapters.length + 1,
        });
        toast({ title: "Materi ditambahkan", variant: "success" });
      }
      fetchChapters();
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (slugCh: string) => {
    try {
      await chapterService.deleteChapter(slug!, slugCh);
      setDeleteConfirm(null);
      fetchChapters();
      toast({ title: "Materi dihapus", variant: "success" });
    } catch (err) {
      console.error(err);
    }
  };


  // Final exam handlers
  const openExamDialog = () => {
    if (finalExam) {
      resetExam({ title: finalExam.title, questions: finalExam.questions });
    } else {
      resetExam({
        title: `Ujian Akhir ${subject.title}`,
        questions: [
          {
            id: `fq-${Math.random().toString(36).substring(2, 9)}`,
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
          },
        ],
      });
    }
    setExamDialogOpen(true);
  };

  const handleSaveExam = async (data: FinalExamFormValues) => {
    try {
      if (finalExam) {
        await finalExamService.updateFinalExam(slug!, data);
        toast({ title: "Ujian Akhir diperbarui", variant: "success" });
      } else {
        await finalExamService.createFinalExam(slug!, data);
        toast({ title: "Ujian Akhir ditambahkan", variant: "success" });
      }
      fetchFinalExam();
      setExamDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExam = async () => {
    try {
      await finalExamService.deleteFinalExam(slug!);
      setDeleteExamConfirm(false);
      fetchFinalExam();
      toast({ title: "Ujian Akhir dihapus", variant: "success" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/subjects"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Pelajaran
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{subject.icon}</span>
            <div>
              <h1 className="font-display text-2xl font-bold">
                {subject.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {chapters.length} materi
              </p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Materi
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {chapters.map((ch) => {
          return (
            <Card key={ch._id} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{ch.title}</p>
                    {ch.hasQuiz && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none h-5 px-1.5 text-[10px] font-bold">
                        QUIZ
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/dashboard/subjects/${slug}/materials/${ch.slug}/quizzes`}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {ch.hasQuiz ? (
                            <ClipboardList className="h-3.5 w-3.5" />
                          ) : (
                            <ClipboardPlus className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ch.hasQuiz ? "Edit Quiz" : "Tambah Quiz"}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(ch)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteConfirm(ch.slug)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {chapters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
            <p>Belum ada materi. Klik "Tambah Materi" untuk memulai.</p>
          </div>
        )}
      </div>

      {/* Final Exam Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> Ujian Akhir
          </h2>
        </div>
        {finalExam ? (
          <Card variant="warning" className="border-2 border-amber-100">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{finalExam.title}</p>
                <p className="text-xs text-muted-foreground">
                  {finalExam.questions.length} soal · Skor minimal 60%
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={openExamDialog}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeleteExamConfirm(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full border-dashed border-2 py-8 rounded-2xl"
            onClick={openExamDialog}
          >
            <Plus className="mr-1 h-4 w-4" /> Tambah Ujian Akhir
          </Button>
        )}
      </div>

      {/* Chapter Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Materi" : "Tambah Materi"}
            </DialogTitle>
          </DialogHeader>
          <FormGenerator
            fields={chapterFields}
            register={registerChapter}
            errors={errorsChapter}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmitChapter(handleSaveChapter)}
              disabled={isSubmittingChapter}
            >
              {isSubmittingChapter
                ? "Menyimpan..."
                : editing
                  ? "Simpan"
                  : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chapter Confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Materi?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Quiz di materi ini juga akan dihapus.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Exam Dialog */}
      <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {finalExam ? "Edit Ujian Akhir" : "Tambah Ujian Akhir"}
            </DialogTitle>
          </DialogHeader>
          <FormGenerator
            fields={examFields}
            register={registerExam}
            errors={errorsExam}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setExamDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmitExam(handleSaveExam)}
              disabled={isSubmittingExam}
            >
              {isSubmittingExam
                ? "Menyimpan..."
                : finalExam
                  ? "Simpan"
                  : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Exam Confirm */}
      <Dialog open={deleteExamConfirm} onOpenChange={setDeleteExamConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Ujian Akhir?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Ujian akhir untuk mata pelajaran ini akan dihapus.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteExamConfirm(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteExam}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
