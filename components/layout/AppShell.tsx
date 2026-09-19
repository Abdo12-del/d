import {
  BookOpen,
  CalendarDays,
  Database,
  Ellipsis,
  FolderOpen,
  House,
  Link2,
<<<<<<< HEAD
  ListTodo,
=======
  ListChecks,
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
  MessagesSquare,
  Repeat,
  Settings2,
<<<<<<< HEAD
  Video,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

function SideItem({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-all",
          isActive
            ? "bg-sky-50 font-extrabold text-sky-700 after:absolute after:right-0 after:top-1/2 after:h-5 after:w-[3px] after:-translate-y-1/2 after:rounded-full after:bg-sky-500"
            : "font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600",
        )
      }
    >
      <Icon className="h-[17px] w-[17px]" />
      {label}
    </NavLink>
  );
}

function SideGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <p className="mb-1.5 px-3 text-[10.5px] font-black tracking-wide text-slate-300">
          {label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

const BOTTOM_NAV = [
  { to: "/", label: "الرئيسية", icon: House, end: true },
  { to: "/tasks", label: "المهام", icon: ListTodo },
  { to: "/routine", label: "الروتين", icon: Repeat },
  { to: "/messages", label: "الرسائل", icon: MessagesSquare },
];

const MORE_ITEMS = [
  { to: "/sessions", label: "الجلسات", icon: Video },
  { to: "/schedule", label: "الجدول", icon: CalendarDays },
  { to: "/links", label: "الروابط", icon: Link2 },
  { to: "/files", label: "الملفات", icon: FolderOpen },
  { to: "/guide", label: "الدليل", icon: BookOpen },
  { to: "/settings", label: "الإعدادات", icon: Settings2 },
  { to: "/admin", label: "إدارة المحتوى", icon: Database },
];
=======
  Star,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const primaryNav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "الرئيسية", icon: House },
  { to: "/tasks", label: "المهام", icon: ListChecks },
  { to: "/schedule", label: "جدول اليوم", icon: CalendarDays },
];

const systemNav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/routine", label: "الروتين", icon: Repeat },
  { to: "/special", label: "المهام الخاصة", icon: Star },
  { to: "/guide", label: "دليل التنفيذ", icon: BookOpen },
];

const referenceNav: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/messages", label: "الرسائل الجاهزة", icon: MessagesSquare },
  { to: "/links", label: "الروابط", icon: Link2 },
  { to: "/rules", label: "التعليمات", icon: Pin },
];

const allNav = [...primaryNav, ...systemNav, ...referenceNav];

function NavigationGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: { to: string; label: string; icon: LucideIcon }[];
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[10px] font-black tracking-wider text-slate-400">{title}</p>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-bold transition-colors",
              isActive
                ? "bg-sky-50 text-sky-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn("h-[17px] w-[17px]", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>{label}</span>
              {isActive && <span className="mr-auto h-1.5 w-1.5 rounded-full bg-sky-500" />}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734

function MoreSheet() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
<<<<<<< HEAD
        <button className="flex flex-col items-center gap-0.5" aria-label="المزيد">
          <span className="flex h-9 w-12 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50">
            <Ellipsis className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-bold">المزيد</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-[26px] pb-8 pt-4">
        <SheetHeader className="text-right">
          <SheetTitle className="text-right text-sm font-black text-slate-600">
            أقسام المنصة
          </SheetTitle>
        </SheetHeader>
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          {MORE_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition",
                  isActive
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200/70 bg-white text-slate-500 hover:bg-slate-50",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[11px] font-extrabold">{item.label}</span>
=======
        <button className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-slate-500 transition hover:bg-slate-50" aria-label="المزيد">
          <Ellipsis className="h-5 w-5" />
          <span className="text-[10px] font-extrabold">المزيد</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 pt-4">
        <SheetHeader><SheetTitle className="text-right text-base font-black text-slate-900">أقسام أخرى</SheetTitle></SheetHeader>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {allNav.slice(3).concat([{ to: "/help", label: "المساعدة", icon: LifeBuoy }]).map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center text-xs font-bold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50">
              <Icon className="h-5 w-5 text-slate-400" />{label}
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AppShell({ children }: { children?: ReactNode }) {
  const location = useLocation();
  return (
<<<<<<< HEAD
    <div className="flex min-h-dvh">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-l border-slate-200/70 bg-white lg:flex">
        <Link to="/" className="flex items-center gap-3 px-6 pb-7 pt-7">
          <Logo size={38} />
          <div className="leading-tight">
            <div className="text-[15px] font-black text-slate-800">
              NG Academy
            </div>
            <div className="mt-0.5 text-[10.5px] font-bold text-slate-400">
              Assistant · المساعد
            </div>
          </div>
        </Link>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <SideGroup label="">
            <SideItem to="/" icon={House} label="الرئيسية" end />
          </SideGroup>
          <SideGroup label="العمل">
            <SideItem to="/tasks" icon={ListTodo} label="المهام" />
            <SideItem to="/sessions" icon={Video} label="الجلسات" />
            <SideItem to="/routine" icon={Repeat} label="الروتين" />
            <SideItem to="/schedule" icon={CalendarDays} label="الجدول" />
          </SideGroup>
          <SideGroup label="الأدوات">
            <SideItem to="/links" icon={Link2} label="الروابط" />
            <SideItem to="/messages" icon={MessagesSquare} label="الرسائل" />
            <SideItem to="/files" icon={FolderOpen} label="الملفات" />
          </SideGroup>
          <SideGroup label="المعرفة">
            <SideItem to="/guide" icon={BookOpen} label="الدليل" />
          </SideGroup>
          <SideGroup label="النظام">
            <SideItem to="/settings" icon={Settings2} label="الإعدادات" />
          </SideGroup>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold text-slate-400 transition hover:bg-slate-50 hover:text-sky-700"
          >
            <Database className="h-4 w-4" />
            إدارة المحتوى
          </Link>
=======
    <div className="min-h-dvh bg-slate-50">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[248px] border-l border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
          <Link to="/" className="flex items-center gap-3"><Logo size={40} /><span className="text-right"><strong className="block text-sm font-black text-slate-900">NG Academy</strong><small className="block text-[10px] font-bold text-slate-400">مركز المهام</small></span></Link>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          <NavigationGroup title="العمل اليومي" items={primaryNav} />
          <NavigationGroup title="النظام" items={systemNav} />
          <NavigationGroup title="المراجع" items={referenceNav} />
        </nav>
        <div className="space-y-1 border-t border-slate-100 p-4">
          <Link to="/help" className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-bold text-slate-500 hover:bg-slate-50"><LifeBuoy className="h-[17px] w-[17px] text-slate-400" />المساعدة</Link>
          <Link to="/admin" className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-bold text-slate-500 hover:bg-slate-50"><Settings2 className="h-[17px] w-[17px] text-slate-400" />الإدارة</Link>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2"><Logo size={36} /><span className="text-sm font-black text-slate-900">NG Academy</span></Link>
          <Link to="/admin" aria-label="الإدارة" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"><Settings2 className="h-4 w-4" /></Link>
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
        </div>
      </aside>

<<<<<<< HEAD
      {/* ─── المحتوى ─── */}
      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <header className="glass sticky top-0 z-40 border-b border-slate-200/60 lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size={32} />
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-800">
                  NG Academy
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  Assistant · المساعد
                </div>
              </div>
            </Link>
            <Link
              to="/settings"
              aria-label="الإعدادات"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-sky-700"
            >
              <Settings2 className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-9">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* ─── Bottom Nav (Mobile) ─── */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/60 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-6 py-1.5">
          {BOTTOM_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-1",
                  isActive ? "text-sky-600" : "text-slate-400",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-9 w-12 items-center justify-center rounded-lg transition",
                      isActive && "bg-sky-50",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold">{item.label}</span>
                </>
              )}
            </NavLink>
=======
      <main key={location.pathname} className="mx-auto w-full max-w-[1440px] animate-fade-up px-4 pb-28 pt-6 sm:px-6 lg:mr-[248px] lg:px-10 lg:pb-12 lg:pt-9">
        {children ?? <Outlet />}
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => cn("flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-extrabold transition", isActive ? "bg-sky-600 text-white" : "text-slate-500 hover:bg-slate-50")}><Icon className="h-5 w-5" />{label}</NavLink>
>>>>>>> c683bf5f3d8ed3a7fc6b1bf2ec146ec0c53ce734
          ))}
          <MoreSheet />
        </div>
      </nav>
    </div>
  );
}
