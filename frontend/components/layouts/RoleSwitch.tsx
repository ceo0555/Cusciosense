"use client";

import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

const roles = ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"] as const;

export function RoleSwitch() {
  const { role, setRole } = useSessionStore();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 p-1">
      {roles.map((item) => (
        <button
          key={item}
          onClick={() => setRole(item)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition",
            role === item
              ? "bg-white text-brand-600 shadow"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {item.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
