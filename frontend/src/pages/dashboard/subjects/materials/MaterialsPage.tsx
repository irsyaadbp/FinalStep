import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ClipboardList,
  ArrowUp,
  ArrowDown,
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
import { useToast } from "../../../../hooks/useToast";
import {
  subjects as initialSubjects,
  allChapters as initialChapters,
  quizzes as initialQuizzes,
  finalExams as initialFinalExams,
} from "../../../app/subjects/data";
import { cn } from "../../../../lib/utils";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  chapterSchema,
  finalExamSchema,
  type ChapterInput as ChapterFormValues,
  type FinalExamInput as FinalExamFormValues,
} from "@finalstep/shared";
import {
  FormGenerator,
  type FormField,
} from "../../../../components/common/FormGenerator";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  completed: boolean;
  order: number;
}

export interface FinalExam {
  id: string;
  subjectId: string;
  title: string;
  questions: QuizQuestion[];
  passed: boolean;
}

export default function MaterialsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const [subjects] = useState(initialSubjects);
  const [chapters, setChapters] = useState<Chapter[]>(
    initialChapters as Chapter[],
  );
  const [quizzes] = useState(initialQuizzes);
  const [finalExams, setFinalExams] = useState<FinalExam[]>(
    initialFinalExams as FinalExam[],
  );

  const subject = subjects.find((s) => s.slug === slug);
  const subjectId = subject?.id.toString();
  const subjectChapters = chapters
    .filter((c) => c.subjectId === subjectId)
    .sort((a, b) => a.order - b.order);
  const finalExam = finalExams.find((fe) => fe.subjectId === subjectId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Chapter react-hook-form
  const {
    register: registerChapter,
    handleSubmit: handleSubmitChapter,
    formState: { errors: errorsChapter },
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
    formState: { errors: errorsExam },
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
            <Card key={q.id} className="p-4 space-y-3">
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
        <p className="text-muted-foreground">Pelajaran tidak ditemukan</p>
        <Link to="/dashboard/subjects">
          <Button variant="link">Kembali ke Daftar Pelajaran</Button>
        </Link>
      </div>
    );
  }

  const addChapter = (chapter: Chapter) => {
    setChapters((prev) => [...prev, chapter]);
  };

  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const deleteChapter = (id: string) => {
    setChapters((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderChapters = (sid: string, fromIndex: number, toIndex: number) => {
    const currentChapters = [...chapters];
    const subjectChs = currentChapters
      .filter((c) => c.subjectId === sid)
      .sort((a, b) => a.order - b.order);

    if (toIndex < 0 || toIndex >= subjectChs.length) return;

    const [moved] = subjectChs.splice(fromIndex, 1);
    subjectChs.splice(toIndex, 0, moved);

    // Update orders
    const updatedWithOrder = subjectChs.map((ch, idx) => ({
      ...ch,
      order: idx + 1,
    }));

    setChapters((prev) => {
      const otherSubjects = prev.filter((c) => c.subjectId !== sid);
      return [...otherSubjects, ...updatedWithOrder];
    });
  };

  const addFinalExam = (exam: FinalExam) => {
    setFinalExams((prev) => [...prev, exam]);
  };

  const updateFinalExam = (sid: string, updates: Partial<FinalExam>) => {
    setFinalExams((prev) =>
      prev.map((fe) => (fe.subjectId === sid ? { ...fe, ...updates } : fe)),
    );
  };

  const deleteFinalExam = (sid: string) => {
    setFinalExams((prev) => prev.filter((fe) => fe.subjectId !== sid));
  };

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

  const handleSaveChapter = (data: ChapterFormValues) => {
    if (editing) {
      updateChapter(editing.id, { title: data.title, content: data.content });
      toast({ title: "Materi diperbarui" });
    } else {
      const dateNow = new Date().getTime();
      const id = `${subjectId}-${dateNow.toString(36)}`;
      addChapter({
        id,
        subjectId: subjectId!,
        title: data.title,
        content:
          data.content ||
          `<h2>${data.title}</h2><p>Konten materi akan ditambahkan di sini.</p>`,
        completed: false,
        order: subjectChapters.length + 1,
      });
      toast({ title: "Materi ditambahkan" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteChapter(id);
    setDeleteConfirm(null);
    toast({ title: "Materi dihapus" });
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

  const handleSaveExam = (data: FinalExamFormValues) => {
    if (finalExam) {
      updateFinalExam(subjectId!, {
        title: data.title,
        questions: data.questions,
      });
      toast({ title: "Ujian Akhir diperbarui" });
    } else {
      addFinalExam({
        id: `final-${subjectId}`,
        subjectId: subjectId!,
        title: data.title,
        questions: data.questions,
        passed: false,
      });
      toast({ title: "Ujian Akhir ditambahkan" });
    }
    setExamDialogOpen(false);
  };

  const handleDeleteExam = () => {
    deleteFinalExam(subjectId!);
    setDeleteExamConfirm(false);
    toast({ title: "Ujian Akhir dihapus" });
  };

  return (
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
                {subjectChapters.length} materi
              </p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Tambah Materi
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {subjectChapters.map((ch, i) => {
          const chapterQuizzes = quizzes.filter((q) => q.chapterId === ch.id);
          return (
            <Card key={ch.id} className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={i === 0}
                    onClick={() => reorderChapters(subjectId!, i, i - 1)}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={i === subjectChapters.length - 1}
                    onClick={() => reorderChapters(subjectId!, i, i + 1)}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ch.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {ch.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Selesai
                      </Badge>
                    )}
                    {chapterQuizzes.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ClipboardList className="h-3 w-3" />{" "}
                        {chapterQuizzes.length} quiz
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/dashboard/subjects/${slug}/materials/${ch.id}/quizzes`}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ClipboardList className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
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
                    onClick={() => setDeleteConfirm(ch.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {subjectChapters.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
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
          <Card variant="warning">
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
            className="w-full border-dashed"
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
            <Button onClick={handleSubmitChapter(handleSaveChapter)}>
              {editing ? "Simpan" : "Tambah"}
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
            <Button onClick={handleSubmitExam(handleSaveExam)}>
              {finalExam ? "Simpan" : "Tambah"}
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
  );
}
