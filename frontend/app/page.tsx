import { DashboardShell } from "@/components/layouts/DashboardShell";
import { AttendanceTrend } from "@/components/charts/AttendanceTrend";
import { FeesTable } from "@/components/tables/FeesTable";
import { HomeworkForm } from "@/components/forms/HomeworkForm";
import { HomeworkSubmissionViewer } from "@/components/homework/HomeworkSubmissionViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <DashboardShell
      title="Unified Control Center"
      subtitle="ERP + Adaptive LMS snapshot across your schools"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Pulse</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTrend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fees At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <FeesTable />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assign Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeworkSubmissionViewer />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
