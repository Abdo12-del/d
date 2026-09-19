import { cn } from "@/lib/utils";

/** بومة NG Academy — الشخصية المرشدة.
 * مرسومة SVG لتعمل بأي حجم؛ استبدلها بسهولة بالأصلية إذا توفر ملفها.
 */

export type OwlPose = "book" | "wave" | "cheer" | "point";

export function Owl({
  size = 120,
  pose = "book",
  className,
}: {
  size?: number;
  pose?: OwlPose;
  className?: string;
}) {
  const uid = `owl-${pose}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden
      className={cn("select-none", className)}
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`${uid}-cap`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#274B77" />
          <stop offset="100%" stopColor="#16304F" />
        </linearGradient>
      </defs>

      {/* خصلتا الرأس */}
      <path d="M56 66 L64 28 L92 52 Z" fill="#0284C7" />
      <path d="M164 66 L156 28 L128 52 Z" fill="#0284C7" />

      {/* الجسم */}
      <ellipse cx="110" cy="126" rx="74" ry="80" fill={`url(#${uid}-body)`} />
      {/* تدرج أسفل الجسم */}
      <ellipse cx="110" cy="176" rx="60" ry="30" fill="#0369A1" opacity="0.25" />

      {/* البطن */}
      <ellipse cx="110" cy="162" rx="46" ry="40" fill="#F0F9FF" />
      <path d="M78 156 q8 8 16 0 M96 160 q8 8 16 0 M114 156 q8 8 16 0" stroke="#BAE6FD" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M86 172 q8 8 16 0 M120 172 q8 8 16 0" stroke="#BAE6FD" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* الأجنحة حسب الوضعية */}
      {pose === "cheer" ? (
        <>
          <ellipse cx="34" cy="88" rx="17" ry="34" fill="#0284C7" transform="rotate(-38 34 88)" />
          <ellipse cx="186" cy="88" rx="17" ry="34" fill="#0284C7" transform="rotate(38 186 88)" />
        </>
      ) : pose === "wave" || pose === "point" ? (
        <>
          <ellipse cx="46" cy="132" rx="16" ry="32" fill="#0284C7" transform="rotate(12 46 132)" />
          <g transform={pose === "wave" ? "rotate(-46 172 96)" : "rotate(-24 172 100)}>
            <ellipse cx="176" cy="106" rx="16" ry="32" fill="#0284C7" />
          </g>
        </>
      ) : (
        <>
          <ellipse cx="40" cy="134" rx="16" ry="33" fill="#0284C7" transform="rotate(10 40 134)" />
          <ellipse cx="180" cy="134" rx="16" ry="33" fill="#0284C7" transform="rotate(-10 180 134)" />
        </>
      )}

      {/* العيون الكبيرة */}
      <circle cx="84" cy="104" r="34" fill="#FFFFFF" />
      <circle cx="136" cy="104" r="34" fill="#FFFFFF" />
      <circle cx="88" cy="108" r="13.5" fill="#123252" />
      <circle cx="132" cy="108" r="13.5" fill="#123252" />
      <circle cx="92.5" cy="103" r="4.6" fill="#FFFFFF" />
      <circle cx="136.5" cy="103" r="4.6" fill="#FFFFFF" />
      <circle cx="84" cy="113" r="2.1" fill="#FFFFFF" opacity="0.85" />
      <circle cx="128" cy="113" r="2.1" fill="#FFFFFF" opacity="0.85" />

      {/* المنقار */}
      <path d="M110 124 L121 134 Q110 146 99 134 Z" fill="#F59E0B" />
      <path d="M104 138 q6 4 12 0" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" fill="none" />

      {/* قبعة التخرج */}
      <ellipse cx="110" cy="52" rx="34" ry="10" fill="#16304F" />
      <path d="M110 10 L172 38 L110 66 L48 38 Z" fill={`url(#${uid}-cap)`} />
      <path d="M110 18 L156 38 L110 58 L64 38 Z" fill="#274B77" opacity="0.55" />
      <circle cx="110" cy="36" r="5" fill="#F8FAFC" />
      {/* الشرّابة */}
      <path d="M168 40 q10 18 2 40" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="170" cy="84" r="6.5" fill="#FBBF24" />

      {/* الكتاب في وضعية book */}
      {pose === "book" && (
        <g>
          <path
            d="M66 170 Q88 158 110 170 Q132 158 154 170 L154 194 Q132 182 110 194 Q88 182 66 194 Z"
            fill="#2563EB"
          />
          <path
            d="M73 173 Q90 164 108 174 L108 190 Q90 181 73 189 Z"
            fill="#EFF6FF"
          />
          <path
            d="M147 173 Q130 164 112 174 L112 190 Q130 181 147 189 Z"
            fill="#EFF6FF"
          />
          <path d="M108 174 L108 190 M112 174 L112 190" stroke="#93C5FD" strokeWidth="2" />
        </g>
      )}

      {/* الأقدام */}
      {!["book"].includes(pose) && (
        <>
          <ellipse cx="90" cy="204" rx="12" ry="6.5" fill="#F59E0B" />
          <ellipse cx="130" cy="204" rx="12" ry="6.5" fill="#F59E0B" />
        </>
      )}

      {/* لمعة صغيرة */}
      <circle cx="52" cy="176" r="3.4" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

/** بومة داخل فقاعة تحدّث المستخدم */
export function OwlSpeech({
  size = 110,
  pose = "wave",
  children,
  className,
}: {
  size?: number;
  pose?: OwlPose;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="animate-float-y shrink-0">
        <Owl size={size} pose={pose} />
      </div>
      <div className="relative mb-3 rounded-[22px] rounded-bl-md border border-white bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}