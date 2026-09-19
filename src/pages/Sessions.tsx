import { ExternalLink, Users, Video } from "lucide-react";
import { externalHref } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import SessionSheet from "@/components/SessionSheet";
import {
  EmptyState,
  LoadingRows,
  PageHeader,
  StatusChip,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useMessages, useSessions } from "@/lib/hooks";
import {
  compareSessions,
  sessionMessage,
  sessionStatus,
  sessionWhenText,
} from "@/lib/sessionUtils";
import { todayISO } from "@/lib/time";
import type { Session } from "@/lib/types";

/**
 * صفحة الجلسات — الفوج ← الجلسة ← التوقيت ← الرابط.
 */
export default function Sessions() {
  const { data: sessions = [], isLoading } = useSessions();
  const { data: messages = [] } = useMessages();
  const [open, setOpen] = useState<{ session: Session; iso: string } | null>(
    null,
  );

  const active = sessions.filter((s) => s.active);
  const today = todayISO();

  const groups = Array.from(new Set(active.map((s) => s.group_name))).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        title="الجلسات"
        desc="كل جلسة مرتبطة بفوجها وموعدها ورابطها الخاص — من؟ ماذا؟ متى؟ أين؟"
      />

      {isLoading ? (
        <LoadingRows />
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-14 text-center">
          <EmptyState
            title="لم تتم إضافة جلسات بعد."
            hint="أنشئ الجلسات مع فوجها ورابط Google Meet الخاص بها من إدارة المحتوى"
          />
          <Button
            asChild
            className="mt-4 h-10 rounded-xl bg-sky-500 px-5 text-[13px] font-extrabold text-white hover:bg-sky-600"
          >
            <Link to="/admin">+ إضافة جلسة</Link>
          </Button>
        </div>
      ) : (
        groups.map((group) => {
          const groupSessions = active
            .filter((s) => s.group_name === group)
            .sort(compareSessions);
          return (
            <section key={group}>
              <h2 className="mb-2.5 flex items-center gap-2 px-1 text-sm font-black text-slate-700">
                <Users className="h-4 w-4 text-sky-500" />
                {group}
                <span className="text-[11px] font-bold text-slate-300">
                  {groupSessions.length} جلسات
                </span>
              </h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
                <div className="divide-y divide-slate-100">
                  {groupSessions.map((s) => {
                    const iso = s.date ?? nextDateOfWeekday(s.weekday);
                    return (
                      <div
                        key={s.id}
                        className="flex flex-wrap items-center gap-3 px-5 py-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                          <Video className="h-5 w-5" />
                        </span>
                        <button
                          onClick={() => setOpen({ session: s, iso })}
                          className="min-w-0 flex-1 text-right"
                        >
                          <p className="text-sm font-extrabold text-slate-800">
                            {s.activity}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                            {iso
                              ? sessionWhenText(s, iso)
                              : "بدون موعد محدد"}
                          </p>
                        </button>
                        {iso && <StatusChip status={sessionStatus(s, iso)} />}
                        {s.meet_url ? (
                          <Button
                            asChild
                            size="sm"
                            className="h-9 gap-1.5 rounded-xl bg-sky-500 px-3.5 text-xs font-extrabold text-white hover:bg-sky-600"
                          >
                            <a
                              href={externalHref(s.meet_url)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              دخول
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        ) : (
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-600">
                            بدون رابط
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })
      )}

      <SessionSheet
        session={open?.session ?? null}
        iso={open?.iso ?? null}
        message={
          open ? sessionMessage(open.session, messages) : null
        }
        onClose={() => setOpen(null)}
      />
    </div>
  );
}

function nextDateOfWeekday(weekday: number | null): string | null {
  if (weekday == null) return null;
  const today = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === weekday) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return iso;
    }
  }
  return null;
}
