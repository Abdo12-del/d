import { Owl } from "./Owl";
import { cn } from "@/lib/utils";

/** شعار NG Academy: البومة + الاسم */
export function Logo({
  size = 44,
  subtitle,
  className,
  light = false,
}: {
  size?: number;
  subtitle?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-soft"
        style={{ width: size, height: size }}
      >
        <Owl size={size * 0.82} pose="book" />
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            "block whitespace-nowrap font-display font-extrabold tracking-tight",
            light ? "text-white" : "text-sky-950",
          )}
          style={{ fontSize: size * 0.4 }}
        >
          NG Academy
        </span>
        {subtitle && (
          <span
            className={cn(
              "block font-bold",
              light ? "text-sky-100/90" : "text-sky-600",
            )}
            style={{ fontSize: size * 0.24 }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}

/** رسم ختامي للاحتفال/الاكتمال */
export function AllClearIllustration({ size = 150 }: { size?: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size * 0.8 }}>
      <span
        aria-hidden
        className="absolute inset-x-6 top-2 bottom-0 rounded-full bg-sky-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="animate-float-y">
          <Owl size={size * 0.78} pose="cheer" />
        </span>
      </span>
      <span aria-hidden className="absolute right-2 top-2 text-xl">⭐</span>
      <span aria-hidden className="absolute left-3 top-8 text-base">✨</span>
    </span>
  );
}
