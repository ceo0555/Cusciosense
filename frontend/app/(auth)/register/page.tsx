"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [form, setForm] = useState({
    schoolName: "",
    email: "",
    phone: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.info("New school registration request", form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Super Admin Access
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Launch SchoolOS for your institution
        </h1>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              School Name
            </label>
            <Input
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              required
              placeholder="Alfanumrik High School"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Work Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Request Demo
          </Button>
        </form>
      </div>
    </div>
  );
}
