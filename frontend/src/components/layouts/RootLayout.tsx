
import { useState } from "react";
import { Outlet } from "react-router";
import { AnimatePresence } from "motion/react";
import SplashScreen from "./SplashScreen";
import { TooltipProvider } from "../ui/Tooltip";
import { Toaster } from "../ui/Sonner";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : (
          <Outlet />
        )}
      </AnimatePresence>
      <Toaster />
    </TooltipProvider>
  );
}
