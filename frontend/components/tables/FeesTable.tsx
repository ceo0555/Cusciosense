"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useSessionStore } from "@/store/session-store";

const baseRows = [
  {
    student: "Aanya Varma",
    class: "Grade 8 A",
    dueOn: "25 Nov",
    amount: "₹18,000",
  },
  {
    student: "Neil Dsouza",
    class: "Grade 10 C",
    dueOn: "30 Nov",
    amount: "₹22,500",
  },
  {
    student: "Fatima Khan",
    class: "Grade 6 B",
    dueOn: "05 Dec",
    amount: "₹16,200",
  },
];

export function FeesTable() {
  const { role } = useSessionStore();

  const rows = useMemo(
    () =>
      baseRows.map((row, index) => ({
        ...row,
        risk: role === "SCHOOL_ADMIN" && index === 0 ? "High" : "Medium",
      })),
    [role]
  );

  return (
    <div className="space-y-4 text-sm">
      {rows.map((row) => (
        <div
          key={row.student}
          className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
        >
          <div>
            <p className="font-medium text-slate-900">{row.student}</p>
            <p className="text-xs text-slate-500">
              {row.class} · Due {row.dueOn}
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-slate-900">
              {row.amount}
            </p>
            <p className="text-xs text-amber-600">{row.risk} risk</p>
          </div>
          <Button size="sm" variant="outline">
            Send Reminder
          </Button>
        </div>
      ))}
    </div>
  );
}
