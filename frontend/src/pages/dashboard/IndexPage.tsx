import { Card, CardContent } from "../../components/ui/Card";
import { BookOpen, ClipboardList, FileText, Users } from "lucide-react";
import { motion } from "motion/react";
import { students, subjects, chapters, quizzes } from "./data";

export default function IndexPage() {
  
  const stats = [
    {
      label: "Total Siswa",
      value: students.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Pelajaran",
      value: subjects.length,
      icon: BookOpen,
      color: "bg-emerald-500",
    },
    {
      label: "Materi",
      value: chapters.length,
      icon: FileText,
      color: "bg-amber-500",
    },
    {
      label: "Quiz",
      value: quizzes.length,
      icon: ClipboardList,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola platform belajar FinalStep
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-5">
          <h2 className="font-display font-semibold mb-3">Siswa Terbaru</h2>
          <div className="space-y-2">
            {students.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-secondary p-3"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{s.xp} XP</p>
                  <p className="text-xs text-muted-foreground">
                    Level {s.level}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
