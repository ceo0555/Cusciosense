"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { RoleSwitch } from "@/components/layouts/RoleSwitch";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
};

export function DashboardShell({
  title,
  subtitle,
  children,
  rightSlot,
  className,
}: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-slate-50">
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-8 py-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-600">
              Alfanumrik SchoolOS
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitch />
            {rightSlot}
          </div>
        </header>
        <section className={cn("px-8 pb-10 pt-8", className)}>
          {children}
        </section>
      </main>
    </div>
  );
}
