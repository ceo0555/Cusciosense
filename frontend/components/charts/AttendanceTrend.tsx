"use client";

import { useMemo } from "react";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function AttendanceTrend() {
  const { role } = useSessionStore();

  const data = useMemo(
    () =>
      weekDays.map((day, index) => ({
        day,
        percentage: 88 + ((index * 7 + role.length) % 10) - 5,
      })),
    [role]
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-2">
        {data.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-8 items-end rounded-full bg-slate-100 p-1">
              <div
                className={cn(
                  "w-full rounded-full bg-brand-500 transition-all"
                )}
                style={{ height: `${item.percentage}%` }}
              />
            </div>
            <div className="text-xs font-medium text-slate-600">{item.day}</div>
            <div className="text-sm font-semibold text-slate-900">
              {item.percentage}%
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Data simulated per role to show how attendance analytics will react to
        user context.
      </p>
    </div>
  );
}
