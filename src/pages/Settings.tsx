import {
  Bell,
  Check,
  ExternalLink,
  HelpCircle,
  Palette,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Owl } from "@/components/Owl";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
        <Icon className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-black text-slate-700">{title}</h2>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-[13px] font-bold text-slate-600">{label}</span>
      {children}
    </div>
  );
}

export default function Settings() {
  const [name, setName] = useState(
    () => localStorage.getItem("ng_name") ?? "",
  );
  const [savedName, setSavedName] = useState(name);
  const [notifSession, setNotifSession] = useState(
    () => localStorage.getItem("ng_notif_session") === "1",
  );
  const [notifDaily, setNotifDaily] = useState(
    () => localStorage.getItem("ng_notif_daily") === "1",
  );

  useEffect(() => {
    localStorage.setItem("ng_notif_session", notifSession ? "1" : "0");
  }, [notifSession]);

  useEffect(() => {
    localStorage.setItem("ng_notif_daily", notifDaily ? "1" : "0");
  }, [notifDaily]);

  const saveName = () => {
    localStorage.setItem("ng_name", name.trim());
    setSavedName(name.trim());
    toast.success("تم حفظ الاسم ✓");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        desc="كيف أضبط النظام؟ تفضيلات بسيطة تخص تجربتك اليومية."
      />

      {/* الحساب */}
      <SectionCard icon={User} title="الحساب">
        <div className="flex items-center gap-3 px-5 py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك ليظهر في الترحيب…"
            className="h-11 flex-1 rounded-xl border-slate-200 text-sm font-bold"
          />
          <Button
            onClick={saveName}
            disabled={name.trim() === savedName}
            className="h-11 gap-1.5 rounded-xl bg-sky-500 px-4 text-xs font-extrabold text-white hover:bg-sky-600 disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            حفظ
          </Button>
        </div>
        <Row label="الدور">
          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-500">
            مساعد
          </span>
        </Row>
      </SectionCard>

      {/* الإشعارات */}
      <SectionCard icon={Bell} title="الإشعارات">
        <Row label="تذكير قبل الجلسات المجدولة">
          <Switch checked={notifSession} onCheckedChange={setNotifSession} />
        </Row>
        <Row label="ملخص المهام في بداية اليوم">
          <Switch checked={notifDaily} onCheckedChange={setNotifDaily} />
        </Row>
      </SectionCard>

      {/* التفضيلات */}
      <SectionCard icon={Check} title="التفضيلات">
        <Row label="اللغة">
          <span className="text-xs font-extrabold text-slate-400">العربية</span>
        </Row>
        <Row label="بداية الأسبوع">
          <span className="text-xs font-extrabold text-slate-400">السبت</span>
        </Row>
        <Row label="تنسيق الوقت">
          <span className="text-xs font-extrabold text-slate-400">24 ساعة</span>
        </Row>
      </SectionCard>

      {/* المظهر */}
      <SectionCard icon={Palette} title="المظهر">
        <Row label="النمط الفاتح — هوية NG Academy">
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-600">
            <Check className="h-3 w-3" strokeWidth={3} />
            نشط
          </span>
        </Row>
        <Row label="النمط الليلي">
          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-300">
            قريبًا
          </span>
        </Row>
      </SectionCard>

      {/* المساعدة */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-4">
          <Owl size={52} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-700">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              المساعدة
            </h2>
            <div className="mt-3 space-y-2">
              <Link
                to="/guide"
                className={cn(
                  "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-extrabold text-slate-600 transition hover:border-sky-300 hover:text-sky-700",
                )}
              >
                دليل العمل الكامل
                <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
              </Link>
              <a
                href="https://wa.me/?text="
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-[13px] font-extrabold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                التواصل مع المسؤول
                <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
