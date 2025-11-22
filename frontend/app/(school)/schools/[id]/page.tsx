import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageProps = {
  params: {
    id: string;
  };
};

const stats = [
  { label: "Students", value: "1,240" },
  { label: "Teachers", value: "68" },
  { label: "Attendance Today", value: "94%" },
  { label: "Fees Collected", value: "₹42L" },
];

export default function SchoolDetailsPage({ params }: PageProps) {
  return (
    <DashboardShell
      title={`School Overview · ${params.id}`}
      subtitle="Admissions, staffing, and subscription health"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Subscription Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-slate-600">
            <li>Trial activated · 01 Sep</li>
            <li>Razorpay plan upgraded · 15 Sep</li>
            <li className="font-semibold text-brand-600">Renewal due · 01 Dec</li>
          </ol>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
