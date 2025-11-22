import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeworkSubmissionViewer } from "@/components/homework/HomeworkSubmissionViewer";

type PageProps = {
  params: {
    id: string;
  };
};

const modules = [
  { title: "Module 1 · Fundamentals", completion: 100 },
  { title: "Module 2 · Practice Sets", completion: 78 },
  { title: "Module 3 · Adaptive Quiz", completion: 46 },
];

export default function CoursePage({ params }: PageProps) {
  return (
    <DashboardShell
      title={`Course Workspace · ${params.id}`}
      subtitle="Adaptive LMS progression & assigned homework"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <div key={module.title}>
                <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <p>{module.title}</p>
                  <p>{module.completion}%</p>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${module.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkSubmissionViewer />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
