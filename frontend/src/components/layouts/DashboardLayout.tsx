import { BookOpen, GraduationCap, LayoutDashboard, LogOutIcon, Settings, Users } from "lucide-react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";

const adminDesktopLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/dashboard/subjects", icon: BookOpen, label: "Pelajaran" },
  { to: "/dashboard/students", icon: Users, label: "Siswa" },
  { to: "/dashboard/settings", icon: Settings, label: "Pengaturan" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const name = user?.name || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[72px] flex-col items-center border-r border-border bg-card py-4">
        <Link
          to="/dashboard"
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
        >
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </Link>
        <span className="text-[9px] font-bold text-foreground tracking-tight mb-6">
          FinalStep
        </span>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {adminDesktopLinks.map((link) => (
            <Tooltip key={link.to} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={link.to}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    isActive(link.to, link.exact)
                      ? "bg-primary text-primary-foreground shadow-[0_4px_0_0_color-mix(in_srgb,var(--color-primary),black_20%)]"
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
                <LogOutIcon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Keluar
            </TooltipContent>
          </Tooltip>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {name ? name.slice(0, 2).toUpperCase() : "AD"}
            </AvatarFallback>
          </Avatar>
        </div>
      </aside>

      {/* Mobile top nav for admin */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-card/90 backdrop-blur-lg md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm">
              FinalStep Admin
            </span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground">
            <LogOutIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex items-center gap-1 px-4 pb-2">
          {adminDesktopLinks.map((link) => {
            const active = isActive(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_3px_0_0_color-mix(in_srgb,var(--color-primary),black_20%)] -translate-y-0.5"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-[72px] pt-[88px] md:pt-0">
        <div className="mx-auto max-w-[1200px] p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
