import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Alfanumrik SchoolOS
          </h1>
          <p className="text-2xl text-white/90 mb-12">
            Complete School ERP + Adaptive LMS Platform
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" variant="secondary">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3">School ERP</h3>
              <p className="text-white/80">
                Complete management system for admissions, fees, attendance, and staff
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3">Adaptive LMS</h3>
              <p className="text-white/80">
                Interactive homework, quizzes, content delivery, and progress tracking
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3">Reports & Analytics</h3>
              <p className="text-white/80">
                Comprehensive reports, digital report cards, and performance insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
