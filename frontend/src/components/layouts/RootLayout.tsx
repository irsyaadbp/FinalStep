
import { Outlet } from "react-router";
import { TooltipProvider } from "../ui/Tooltip";

export default function RootLayout() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}
