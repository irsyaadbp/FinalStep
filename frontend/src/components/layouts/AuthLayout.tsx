import { Outlet } from "react-router";
import { motion } from "motion/react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 overflow-hidden relative">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[380px] relative z-10"
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
