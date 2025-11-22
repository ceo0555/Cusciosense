"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function HomeworkForm() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.info("Homework payload", {
      title,
      dueDate,
      instructions,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Title
        </label>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Algebra mastery worksheet"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Due Date
        </label>
        <Input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Instructions
        </label>
        <Textarea
          rows={4}
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="Outline key expectations, rubric, or resources."
        />
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        <p className="flex items-center gap-2 font-semibold text-slate-700">
          <Upload className="h-4 w-4 text-brand-500" />
          Rich Submission Options
        </p>
        <p className="text-xs">
          Students will be able to write responses, draw using our canvas, or
          upload PDFs/images. Configure limits here once backend endpoints are wired.
        </p>
      </div>
      <Button type="submit" className="w-full">
        Save Homework Template
      </Button>
    </form>
  );
}
