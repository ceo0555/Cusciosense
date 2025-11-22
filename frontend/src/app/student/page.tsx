'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import { BookOpen, FileText, Calendar, BarChart3, Bell } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/student', icon: BarChart3 },
  { name: 'My Courses', href: '/student/courses', icon: BookOpen },
  { name: 'Homework', href: '/student/homework', icon: FileText },
  { name: 'Attendance', href: '/student/attendance', icon: Calendar },
  { name: 'Exams & Results', href: '/student/exams', icon: FileText },
  { name: 'Notifications', href: '/student/notifications', icon: Bell },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">92.5%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">185 of 200 days present</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">85.3%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Rank: 5/40</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Homework Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">2 due this week</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All subjects</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Homework */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Homework</h3>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', title: 'Chapter 5 Exercises', due: '2 days' },
                { subject: 'English', title: 'Essay Writing', due: '3 days' },
                { subject: 'Science', title: 'Lab Report', due: '5 days' },
              ].map((hw, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{hw.title}</p>
                    <p className="text-sm text-gray-600">{hw.subject}</p>
                  </div>
                  <span className="text-sm text-gray-500">Due in {hw.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-4">
              {[
                { subject: 'Mathematics', marks: '87/100', grade: 'A' },
                { subject: 'Science', marks: '92/100', grade: 'A+' },
                { subject: 'English', marks: '78/100', grade: 'B+' },
              ].map((grade, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{grade.subject}</p>
                    <p className="text-sm text-gray-600">{grade.marks}</p>
                  </div>
                  <span className="badge badge-success">{grade.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
