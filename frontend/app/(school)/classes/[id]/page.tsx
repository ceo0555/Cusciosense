import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTrend } from "@/components/charts/AttendanceTrend";
import { HomeworkForm } from "@/components/forms/HomeworkForm";

type PageProps = {
  params: {
    id: string;
  };
};

const roster = [
  { name: "Ishaan P.", attendance: "98%" },
  { name: "Meera S.", attendance: "92%" },
  { name: "Kabir R.", attendance: "88%" },
];

export default function ClassDetailsPage({ params }: PageProps) {
  return (
    <DashboardShell
      title={`Class Planner · ${params.id}`}
      subtitle="Timetable, attendance, and homework orchestration"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTrend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Homeroom Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {roster.map((student) => (
              <div key={student.name} className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{student.name}</span>
                <span className="text-xs text-slate-500">{student.attendance}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Schedule Homework</CardTitle>
        </CardHeader>
        <CardContent>
          <HomeworkForm />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
