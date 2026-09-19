import {
  BookOpen,
  CalendarDays,
  Database,
  Ellipsis,
  FolderOpen,
  House,
  Link2,
  ListTodo,
  MessagesSquare,
  Repeat,
  Settings2,
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

function MoreSheet() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
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
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AppShell({ children }: { children?: ReactNode }) {
  return (
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
        </div>
      </aside>

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
          ))}
          <MoreSheet />
        </div>
      </nav>
    </div>
  );
}
