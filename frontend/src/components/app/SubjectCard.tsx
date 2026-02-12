import { motion } from "motion/react";
import { Link } from "react-router";
import { Card, CardContent } from "../ui/Card";

export interface Subject {
  id: number;
  title: string;
  progress: number;
  icon: string;
}

interface SubjectCardProps {
  subject: Subject;
  index: number;
}

export function SubjectCard({ subject, index }: SubjectCardProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (subject.progress / 100) * circumference;
  const isComplete = subject.progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.04 }}
      className="snap-start shrink-0"
    >
      <Link to={`/material/${subject.id}`}>
        <Card
          className={`shadow-card hover:shadow-elevated transition-all cursor-pointer ${
            isComplete ? "border-success/30" : ""
          }`}
        >
          <CardContent className="flex flex-col items-center p-4 gap-2">
            <div className="relative flex items-center justify-center">
              <svg width="76" height="76" className="-rotate-90">
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke={
                    isComplete ? "var(--color-success)" : "var(--color-primary)"
                  }
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: 0.2 + index * 0.05,
                  }}
                />
              </svg>
              <div className="absolute text-2xl">{subject.icon}</div>
            </div>
            <p className="text-xs font-semibold text-center leading-tight line-clamp-2">
              {subject.title}
            </p>
            <span
              className={`text-[10px] font-bold ${
                isComplete ? "text-success" : "text-muted-foreground"
              }`}
            >
              {isComplete ? "✅ Selesai" : `${subject.progress}%`}
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
