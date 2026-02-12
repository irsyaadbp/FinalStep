import { motion } from "motion/react";
import { SubjectCard } from "../../../components/app/SubjectCard";

export default function SubjectsPage() {
  const subjects = [
    { id: 'math', slug: 'math', title: 'Matematika', icon: '📐', color: 'bg-blue-500', progress: 60, totalChapters: 4, completedChapters: 2 },
    { id: 'physics', slug: 'physics', title: 'Fisika', icon: '⚡', color: 'bg-amber-500', progress: 33, totalChapters: 3, completedChapters: 1 },
    { id: 'chemistry', slug: 'chemistry', title: 'Kimia', icon: '🧪', color: 'bg-emerald-500', progress: 50, totalChapters: 2, completedChapters: 1 },
    { id: 'biology', slug: 'biology', title: 'Biologi', icon: '🧬', color: 'bg-pink-500', progress: 50, totalChapters: 2, completedChapters: 1 },
    { id: 'english', slug: 'english', title: 'Bahasa Inggris', icon: '📝', color: 'bg-cyan-500', progress: 50, totalChapters: 2, completedChapters: 1 },
    { id: 'indonesian', slug: 'indonesian', title: 'Bahasa Indonesia', icon: '📖', color: 'bg-red-500', progress: 50, totalChapters: 2, completedChapters: 1 },
  ];

  const chapters = [
    // Math
    { id: 'math-1', subjectId: 'math', title: 'Limit Fungsi', completed: true, order: 1, content: '<h2>Limit Fungsi</h2>...' },
    { id: 'math-2', subjectId: 'math', title: 'Turunan Fungsi', completed: true, order: 2, content: '<h2>Turunan Fungsi</h2>...' },
    { id: 'math-3', subjectId: 'math', title: 'Integral', completed: false, order: 3, content: '<h2>Integral</h2>...' },
    { id: 'math-4', subjectId: 'math', title: 'Matriks', completed: false, order: 4, content: '<h2>Matriks</h2>...' },
    // Physics
    { id: 'physics-1', subjectId: 'physics', title: 'Kinematika', completed: true, order: 1, content: '<h2>Kinematika</h2>...' },
    { id: 'physics-2', subjectId: 'physics', title: 'Dinamika', completed: false, order: 2, content: '<h2>Dinamika</h2>...' },
    { id: 'physics-3', subjectId: 'physics', title: 'Usaha dan Energi', completed: false, order: 3, content: '<h2>Usaha dan Energi</h2>...' },
    // Chemistry
    { id: 'chem-1', subjectId: 'chemistry', title: 'Struktur Atom', completed: true, order: 1, content: '<h2>Struktur Atom</h2>...' },
    { id: 'chem-2', subjectId: 'chemistry', title: 'Ikatan Kimia', completed: false, order: 2, content: '<h2>Ikatan Kimia</h2>...' },
    // Biology
    { id: 'bio-1', subjectId: 'biology', title: 'Sel', completed: true, order: 1, content: '<h2>Sel</h2>...' },
    { id: 'bio-2', subjectId: 'biology', title: 'Genetika', completed: false, order: 2, content: '<h2>Genetika</h2>...' },
    // English
    { id: 'eng-1', subjectId: 'english', title: 'Tenses', completed: true, order: 1, content: '<h2>Tenses</h2>...' },
    { id: 'eng-2', subjectId: 'english', title: 'Passive Voice', completed: false, order: 2, content: '<h2>Passive Voice</h2>...' },
    // Indonesian
    { id: 'ind-1', subjectId: 'indonesian', title: 'Teks Eksposisi', completed: true, order: 1, content: '<h2>Teks Eksposisi</h2>...' },
    { id: 'ind-2', subjectId: 'indonesian', title: 'Teks Prosedur', completed: false, order: 2, content: '<h2>Teks Prosedur</h2>...' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Pelajaran</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subjects.length} mata pelajaran
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {subjects.map((s, i) => {
          const subChapters = chapters.filter((c) => c.subjectId === s.id);
          const completedCount = subChapters.filter((c) => c.completed).length;
          const subjectWithStats = {
            ...s,
            totalChapters: subChapters.length,
            completedChapters: completedCount,
          };

          return (
            <SubjectCard key={s.id} subject={subjectWithStats} index={i} />
          );
        })}
      </div>
    </div>
  );
}
