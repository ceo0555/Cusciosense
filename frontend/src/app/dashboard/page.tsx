'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/lib/auth/AuthContext'
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your school today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value="1,234"
            icon={<Users className="h-6 w-6 text-primary-600" />}
            trend="+12% from last month"
            trendUp
          />
          <StatCard
            title="Active Courses"
            value="48"
            icon={<BookOpen className="h-6 w-6 text-green-600" />}
            trend="5 new this week"
            trendUp
          />
          <StatCard
            title="Attendance Today"
            value="94%"
            icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
            trend="Above average"
            trendUp
          />
          <StatCard
            title="Pending Tasks"
            value="23"
            icon={<Clock className="h-6 w-6 text-orange-600" />}
            trend="15 due this week"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <ActivityItem
                title="New homework assigned"
                description="Mathematics Chapter 5 - Due in 3 days"
                time="2 hours ago"
                icon={<BookOpen className="h-5 w-5 text-blue-600" />}
              />
              <ActivityItem
                title="Attendance marked"
                description="Class 10A - 95% present"
                time="5 hours ago"
                icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              />
              <ActivityItem
                title="Exam scheduled"
                description="Mid-term Mathematics - Dec 25"
                time="1 day ago"
                icon={<Calendar className="h-5 w-5 text-orange-600" />}
              />
              <ActivityItem
                title="Grade published"
                description="Unit Test 3 results available"
                time="2 days ago"
                icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
              />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              <EventItem
                title="Parent-Teacher Meeting"
                date="Dec 22, 2024"
                time="10:00 AM"
                type="meeting"
              />
              <EventItem
                title="Mid-Term Examinations"
                date="Dec 25-30, 2024"
                time="9:00 AM - 12:00 PM"
                type="exam"
              />
              <EventItem
                title="Sports Day"
                date="Jan 5, 2025"
                time="8:00 AM onwards"
                type="event"
              />
              <EventItem
                title="Science Fair"
                date="Jan 10, 2025"
                time="10:00 AM"
                type="event"
              />
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-900">
                Action Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have 12 homework submissions pending review and 5 attendance
                records to approve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

function EventItem({
  title,
  date,
  time,
  type,
}: {
  title: string
  date: string
  time: string
  type: string
}) {
  const typeColors = {
    meeting: 'bg-blue-100 text-blue-800',
    exam: 'bg-red-100 text-red-800',
    event: 'bg-green-100 text-green-800',
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{date}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <span className={`badge ${typeColors[type as keyof typeof typeColors]}`}>
        {type}
      </span>
    </div>
  )
}
