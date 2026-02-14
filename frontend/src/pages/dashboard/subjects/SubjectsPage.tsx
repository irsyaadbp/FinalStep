import { Link } from "react-router";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import {
  BookOpen,
  ClipboardList,
  FileTextIcon,
  PencilIcon,
  Trash2Icon,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialog";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  subjectSchema,
  type Subject,
  type SubjectInput as SubjectFormValues,
} from "@finalstep/shared";
import {
  FormGenerator,
  type FormField,
} from "../../../components/common/FormGenerator";
import { subjectService } from "../../../service/subject";
import { useAsyncFetch } from "../../../hooks/useAsyncFetch";

const COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-orange-500",
];
const ICONS = ["📐", "⚡", "🧪", "🧬", "📝", "📖", "🎨", "🌍", "💻", "🎵"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch subjects
  const { execute: fetchSubjects } = useAsyncFetch(
    async () => {
      return await subjectService.getSubjects();
    },
    {
      onSuccess: (res) => {
        if (res.data) {
          setSubjects(res.data);
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      title: "",
      icon: "📐",
      color: "bg-blue-500",
    },
  });

  const watchIcon = watch("icon");
  const watchColor = watch("color");

  const fields: FormField<SubjectFormValues>[] = [
    {
      id: "title",
      label: "Nama Pelajaran",
      placeholder: "Matematika",
    },
    {
      id: "icon",
      label: "Icon",
      render: () => (
        <div className="flex flex-wrap gap-2">
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setValue("icon", ic)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-colors ${
                watchIcon === ic
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {ic}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "color",
      label: "Warna",
      render: () => (
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setValue("color", c)}
              className={`h-8 w-8 rounded-lg ${c} transition-all ${
                watchColor === c ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
      ),
    },
  ];

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", icon: "📐", color: "bg-blue-500" });
    setDialogOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditing(s);
    reset({
      title: s.title,
      icon: s.icon,
      color: s.color || "bg-blue-500",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      if (editing) {
        await subjectService.updateSubject(editing.slug, data);
        toast({ title: "Pelajaran diperbarui", variant: "success" });
      } else {
        await subjectService.createSubject(data);
        toast({ title: "Pelajaran ditambahkan", variant: "success" });
      }
      fetchSubjects();
      setDialogOpen(false);
    } catch (error) {
      // Error handling is done by $fetch, but we can catch here if needed
      console.error(error);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await subjectService.deleteSubject(slug);
      setDeleteConfirm(null);
      fetchSubjects();
      toast({ title: "Pelajaran dihapus", variant: "success" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Pelajaran</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {subjects.length} pelajaran
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Tambah
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => {
          const chCount = s.totalChapters || 0;
          const qCount = s.totalQuizzes || 0;
          return (
            <Card key={s._id} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg`}
                      style={{
                        backgroundColor: s.color
                      }}
                    >
                      {s.icon}
                    </div>
                    <h3 className="font-display font-semibold">{s.title}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(s)}
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteConfirm(s.slug)}
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <FileTextIcon className="h-3.5 w-3.5" /> {chCount} materi
                  </span>
                  <span className="flex items-center gap-1">
                    <ClipboardList className="h-3.5 w-3.5" /> {qCount} quiz
                  </span>
                </div>
                <Link to={`/dashboard/subjects/${s.slug}/materials`}>
                  <Button variant="outline" className="w-full" size="sm">
                    <BookOpen className="mr-1 h-3.5 w-3.5" /> Kelola Materi &
                    Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Pelajaran" : "Tambah Pelajaran"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <FormGenerator
                fields={fields}
                register={register}
                errors={errors}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Menyimpan..."
                  : editing
                  ? "Simpan"
                  : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pelajaran?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Semua materi dan quiz dalam pelajaran ini juga akan dihapus.
            Tindakan ini tidak bisa dibatalkan.
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
    </div>
  );
}
