"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  GraduationCap,
  Home,
  NotebookPen,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/schools/alpha", label: "Schools", icon: Building2 },
  { href: "/classes/grade-8", label: "Classes", icon: NotebookPen },
  { href: "/lms", label: "LMS", icon: GraduationCap },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/exams", label: "Exams", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white font-semibold">
          AS
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Alfanumrik</p>
          <p className="text-xs text-slate-500">SchoolOS</p>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100",
                isActive
                  ? "bg-slate-100 text-brand-600"
                  : "text-slate-600"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg bg-slate-100 p-4 text-xs text-slate-500">
        Need help? Reach out to <span className="font-semibold">support@alfanumrik.com</span>
      </div>
    </aside>
  );
}
