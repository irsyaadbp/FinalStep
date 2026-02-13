import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Plus, Pencil, Trash2, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Label } from '../../../../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/Dialog';
import { useToast } from '../../../../hooks/useToast';
import { subjects, allChapters as chapters, quizzes as initialQuizzes } from '../../../app/subjects/data';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quizSchema, type QuizInput as QuizFormValues } from '@finalstep/shared';
import { cn } from '../../../../lib/utils';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  questions: QuizQuestion[];
}

export default function AdminQuizzes() {
  const { slug, materialSlug } = useParams<{ slug: string; materialSlug: string }>();
  const { toast } = useToast();

  const [localQuizzes, setLocalQuizzes] = useState<Quiz[]>(initialQuizzes as Quiz[]);

  const subject = subjects.find((s) => s.slug === slug);
  const chapter = chapters.find((c) => c.id === materialSlug);
  const chapterQuizzes = localQuizzes.filter((q) => q.chapterId === materialSlug);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [{ id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0 }],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  if (!subject || !chapter) {
    return (
      <div className="text-muted-foreground text-center py-20">
        <p>Tidak ditemukan</p>
        <Link to="/dashboard/subjects">
          <Button variant="link">Kembali ke Daftar Pelajaran</Button>
        </Link>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    reset({
      title: '',
      questions: [{ id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0 }],
    });
    setDialogOpen(true);
  };

  const openEdit = (q: Quiz) => {
    setEditing(q);
    reset({
      title: q.title,
      questions: q.questions,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: QuizFormValues) => {
    if (editing) {
      setLocalQuizzes(localQuizzes.map(q => q.id === editing.id ? { ...q, title: data.title, questions: data.questions } : q));
      toast({ title: 'Quiz diperbarui' });
    } else {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        chapterId: materialSlug!,
        subjectId: subject.id.toString(),
        title: data.title,
        questions: data.questions,
      };
      setLocalQuizzes([...localQuizzes, newQuiz]);
      toast({ title: 'Quiz ditambahkan' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setLocalQuizzes(localQuizzes.filter(q => q.id !== id));
    setDeleteConfirm(null);
    toast({ title: 'Quiz dihapus' });
  };

  const watchQuestions = watch('questions');

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/dashboard/subjects/${slug}/materials`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" /> Kembali ke Materi
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{subject.icon} {subject.title}</span>
              <span>›</span>
              <span>{chapter.title}</span>
            </div>
            <h1 className="font-display text-2xl font-bold">Quiz</h1>
            <p className="text-muted-foreground text-sm">{chapterQuizzes.length} quiz</p>
          </div>
          <Button onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Tambah Quiz</Button>
        </div>
      </div>

      <div className="space-y-3">
        {chapterQuizzes.map((q) => (
          <Card key={q.id} className="shadow-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{q.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{q.questions.length} pertanyaan</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(q)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(q.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {chapterQuizzes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Belum ada quiz. Klik "Tambah Quiz" untuk memulai.</p>
          </div>
        )}
      </div>

      {/* Quiz Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Quiz' : 'Tambah Quiz'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-2">
              <Label htmlFor="title">Judul Quiz</Label>
              <Input 
                id="title"
                {...register('title')} 
                placeholder="Quiz Limit Fungsi" 
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-4">
              {questionFields.map((field, qi) => (
                <div key={field.id} className="rounded-xl border border-border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Pertanyaan {qi + 1}</Label>
                    {questionFields.length > 1 && (
                      <Button variant="ghost" size="sm" type="button" className="h-7 text-destructive" onClick={() => removeQuestion(qi)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  
                  <Input
                    {...register(`questions.${qi}.question`)}
                    placeholder="Tulis pertanyaan..."
                    className={cn(errors.questions?.[qi]?.question && "border-destructive")}
                  />
                  {errors.questions?.[qi]?.question && (
                    <p className="text-xs text-destructive">{errors.questions[qi].question.message}</p>
                  )}

                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((oi) => (
                      <div key={oi} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setValue(`questions.${qi}.correctAnswer`, oi)}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                              watchQuestions?.[qi]?.correctAnswer === oi ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <Input
                            {...register(`questions.${qi}.options.${oi}`)}
                            placeholder={`Opsi ${String.fromCharCode(65 + oi)}`}
                            className={cn("flex-1", errors.questions?.[qi]?.options?.[oi] && "border-destructive")}
                          />
                        </div>
                        {errors.questions?.[qi]?.options?.[oi] && (
                          <p className="text-[10px] text-destructive ml-9">{errors.questions[qi].options[oi].message}</p>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-1">Klik huruf untuk menandai jawaban benar</p>
                  </div>
                </div>
              ))}

              <Button variant="outline" type="button" className="w-full" onClick={() => appendQuestion({ id: `q-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0 })}>
                <Plus className="mr-1 h-4 w-4" /> Tambah Pertanyaan
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit">{editing ? 'Simpan' : 'Tambah'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Hapus Quiz?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Tindakan ini tidak bisa dibatalkan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
