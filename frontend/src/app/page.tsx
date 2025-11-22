import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Calendar, BarChart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Alfanumrik SchoolOS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Modern School Management
            <span className="block text-primary-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete School ERP and Adaptive Learning Management System designed for
            educational institutions. Manage admissions, attendance, homework, exams,
            and more from one powerful platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="btn-secondary text-lg px-8 py-3"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything Your School Needs
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary-600" />}
            title="Student Management"
            description="Complete student profiles, admissions, and enrollment management."
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-primary-600" />}
            title="Attendance & Timetable"
            description="Digital attendance tracking and automated timetable generation."
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-primary-600" />}
            title="Learning Management"
            description="Course creation, homework assignments, and online quizzes."
          />
          <FeatureCard
            icon={<BarChart className="h-10 w-10 text-primary-600" />}
            title="Reports & Analytics"
            description="Comprehensive reports, grade cards, and performance analytics."
          />
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Everyone
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <UserTypeCard title="Super Admin" description="Manage multiple schools" />
            <UserTypeCard title="School Admin" description="Run your institution" />
            <UserTypeCard title="Teachers" description="Teach and grade" />
            <UserTypeCard title="Students" description="Learn and submit work" />
            <UserTypeCard title="Parents" description="Monitor progress" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of schools already using SchoolOS
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Alfanumrik SchoolOS</h4>
              <p className="text-sm">
                Complete school management and learning system for modern educational
                institutions.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Alfanumrik SchoolOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function UserTypeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
      <h5 className="font-semibold text-gray-900 mb-2">{title}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
