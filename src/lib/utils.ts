import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * يحوّل أي رابط خارجي إلى رابط مطلق قبل وضعه في href.
 * إذا حُفظ الرابط بلا بروتوكول (مثل meet.google.com/xxx) يتعامل معه
 * المتصفح كمسار داخلي فتظهر صفحة 404 — هذه الدالة تمنع ذلك.
 */
export function externalHref(url: string | null | undefined): string {
  if (!url) return "#";
  const u = url.trim();
  if (!u) return "#";
  if (/^(https?:)?\/\//i.test(u)) return u;
  if (/^(mailto:|tel:)/i.test(u)) return u;
  // نطاق بلا بروتوكول مثل meet.google.com/xxx أو www.site.com/path?a=1
  if (/^[\w-]+(\.[\w-]+)+([/?#:].*)?$/i.test(u)) return `https://${u}`;
  return u;
}
