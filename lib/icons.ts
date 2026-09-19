import {
  BookOpen,
  ClipboardList,
  Facebook,
  Folder,
  GraduationCap,
  Link2,
  ListChecks,
  LucideIcon,
  MessageCircle,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  video: Video,
  "message-circle": MessageCircle,
  folder: Folder,
  "clipboard-list": ClipboardList,
  facebook: Facebook,
  link: Link2,
  "book-open": BookOpen,
  "list-checks": ListChecks,
  sparkles: Sparkles,
  star: Star,
  graduation: GraduationCap,
};

export const ICON_KEYS = Object.keys(ICONS);

export function iconByName(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Link2;
}
