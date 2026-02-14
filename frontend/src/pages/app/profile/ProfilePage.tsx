import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../../components/ui/Card";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";
import {
  BookOpen,
  ChevronRight,
  Flame,
  GraduationCap,
  LogOut,
  Mail,
  Settings,
  Shield,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000,
];

function getXPProgress(xp: number, level: number) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold =
    LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress =
    ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { progress: Math.min(100, Math.max(0, progress)), nextThreshold };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const name = user?.name || "Student";
  const email = user?.email || "";
  const targetUniversity = user?.targetUniversity || "-";
  const streak = user?.streak || 0;
  // TODO: Calculate these from real progress data
  const completedChapters = 0;
  const overallProgress = 0;

  const subjects =
    user?.progress?.map((p, i) => ({
      id: i,
      title: p.subjectSlug, // We might need a map for slug -> title
      progress: p.progressPercent,
      icon: "📚",
    })) || [];

  const { progress: levelProgress, nextThreshold } = getXPProgress(xp, level);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-card overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-level/10 pointer-events-none" />
          <CardContent className="relative p-6 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                  <AvatarFallback className="bg-linear-to-br from-primary to-level text-xl font-bold text-primary-foreground">
                    {name ? name.slice(0, 2).toUpperCase() : "ST"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card border-2 border-level shadow">
                  <Shield className="h-3.5 w-3.5 text-level" />
                </div>
              </div>
            </motion.div>
            <h2 className="font-display text-xl font-bold mt-3">
              {name || "Student"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>{email}</span>
            </div>
            {targetUniversity && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Target: {targetUniversity}</span>
              </div>
            )}

            {/* Level bar inside profile */}
            <div className="w-full max-w-xs mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-display">
                  Level {level}
                </span>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-xp" />
                  <span className="text-xs font-bold text-xp">{xp} XP</span>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-xp shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-1px_2px_0_rgba(0,0,0,0.1)]"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {nextThreshold - xp} XP ke Level {level + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-4 gap-2">
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <Flame className="h-5 w-5 text-streak mx-auto mb-1" />
              <p className="text-lg font-black font-display">{streak}</p>
              <p className="text-[10px] text-muted-foreground">Streak</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <Trophy className="h-5 w-5 text-level mx-auto mb-1" />
              <p className="text-lg font-black font-display">Lv.{level}</p>
              <p className="text-[10px] text-muted-foreground">Level</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <BookOpen className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black font-display">
                {completedChapters}
              </p>
              <p className="text-[10px] text-muted-foreground">Bab</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-3 text-center">
              <Star className="h-5 w-5 text-xp mx-auto mb-1" />
              <p className="text-lg font-black font-display">
                {overallProgress}%
              </p>
              <p className="text-[10px] text-muted-foreground">Progres</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Menu items */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-card">
          <CardContent className="p-0 divide-y divide-border">
            {[
              {
                icon: BookOpen,
                label: "Pelajaran Saya",
                desc: `${subjects.length} mata pelajaran`,
                to: "/subjects",
              },
              {
                icon: Settings,
                label: "Pengaturan",
                desc: "Profil & preferensi",
                to: "/profile",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shrink-0">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Keluar dari Akun
        </Button>
      </motion.div>
    </div>
  );
}
