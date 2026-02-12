import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 600);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-primary"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="rounded-2xl bg-primary-foreground/15 p-5 backdrop-blur-sm">
          <GraduationCap className="h-16 w-16 text-primary-foreground" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-2 font-display text-3xl font-bold text-primary-foreground"
      >
        FinalStep
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-10 text-sm text-primary-foreground/70"
      >
        Persiapkan masa depanmu
      </motion.p>

      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 200 }}
        transition={{ delay: 0.6 }}
        className="h-1.5 overflow-hidden rounded-full bg-primary-foreground/20"
      >
        <motion.div
          className="h-full rounded-full bg-primary-foreground"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
