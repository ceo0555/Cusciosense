import { DashboardShell } from "@/components/layouts/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeesTable } from "@/components/tables/FeesTable";

type PageProps = {
  params: {
    id: string;
  };
};

export default function FeeLedgerPage({ params }: PageProps) {
  return (
    <DashboardShell
      title={`Fee Ledger · ${params.id}`}
      subtitle="Invoices, Razorpay settlements, and parent reminders"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoices Due</CardTitle>
          </CardHeader>
          <CardContent>
            <FeesTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• Razorpay success rate last 30 days: <strong>97.4%</strong></p>
            <p>• Auto reminders scheduled daily at 6pm IST.</p>
            <p>• Settlement T+2, payout to Alfanumrik wallet.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
