"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const tabs = ["Text", "Drawing", "Uploads"] as const;

export function HomeworkSubmissionViewer() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Text");

  return (
    <div className="space-y-4 text-sm">
      <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 rounded-full px-3 py-1 ${
              active === tab ? "bg-white text-brand-600 shadow" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {active === "Text" && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
          “Photosynthesis is the process by which green plants convert light
          energy into chemical energy. Chlorophyll captures sunlight, initiating
          the light-dependent reaction...” – <strong>Riya Patil</strong>
        </p>
      )}
      {active === "Drawing" && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://placehold.co/600x300/1d4ed8/FFF?text=Diagram"
            alt="Student drawing placeholder"
            width={600}
            height={300}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      {active === "Uploads" && (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-500">
          <p>uploads/photosynthesis-lab.pdf · 2.1 MB</p>
          <p>uploads/leaf-structure.jpg · 680 KB</p>
        </div>
      )}
      <div className="flex gap-3">
        <Button className="flex-1">Approve</Button>
        <Button variant="outline" className="flex-1">
          Request Rework
        </Button>
      </div>
    </div>
  );
}
