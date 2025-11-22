import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeworkForm } from "@/components/forms/HomeworkForm";
import { HomeworkSubmissionViewer } from "@/components/homework/HomeworkSubmissionViewer";

type PageProps = {
  params: {
    id: string;
  };
};

export default function HomeworkDetailsPage({ params }: PageProps) {
  return (
    <DashboardShell
      title={`Homework · ${params.id}`}
      subtitle="Instructions, submissions, and grading flows"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submission Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkSubmissionViewer />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
