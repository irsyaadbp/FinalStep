import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, User, GraduationCap, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";

const studentDesktopLinks = [
  { to: "/", icon: Home, label: "Beranda" },
  { to: "/subjects", icon: BookOpen, label: "Pelajaran" },
  { to: "/profile", icon: User, label: "Profil" },
];

const studentMobileLinks = [
  { to: "/", icon: Home, label: "Beranda" },
  { to: "/subjects", icon: BookOpen, label: "Pelajaran" },
  { to: "/profile", icon: User, label: "Profil" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const name = "Irsyaad"

  const handleLogout = () => {
    // logout();
    navigate("/login");
  };

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[72px] flex-col items-center border-r border-border bg-card py-4">
        <Link
          to="/"
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
        >
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </Link>
        <span className="text-[9px] font-bold text-foreground tracking-tight mb-6">
          FinalStep
        </span>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {studentDesktopLinks.map((link) => (
            <Tooltip key={link.to} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.to}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isActive(link.to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {link.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Keluar
            </TooltipContent>
          </Tooltip>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {name ? name.slice(0, 2).toUpperCase() : "ST"}
            </AvatarFallback>
          </Avatar>
        </div>
      </aside>

      {/* Mobile bottom nav — app-like */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card md:hidden safe-area-bottom">
        <div className="flex items-end justify-around px-2 pb-1 pt-1.5">
          {studentMobileLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex flex-col items-center gap-0.5 py-1 min-w-[56px]"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-[18px] w-[18px]" />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-[72px] pb-24 md:pb-0 overflow-x-hidden">
        <div className="mx-auto max-w-[900px] p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
