'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import { Users, BookOpen, FileText, Calendar, CheckSquare, BarChart3 } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/teacher', icon: BarChart3 },
  { name: 'My Classes', href: '/teacher/classes', icon: Users },
  { name: 'Courses', href: '/teacher/courses', icon: BookOpen },
  { name: 'Homework', href: '/teacher/homework', icon: FileText },
  { name: 'Attendance', href: '/teacher/attendance', icon: CheckSquare },
  { name: 'Grades', href: '/teacher/grades', icon: BarChart3 },
]

export default function TeacherDashboard() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your classes and students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">120</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Across 3 classes</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classes Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Next: Math at 10:00 AM</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Grading</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Homework submissions</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Class Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">78.5%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last assessment</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
              <CheckSquare className="h-5 w-5 mr-2" />
              Mark Attendance
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <FileText className="h-5 w-5 mr-2" />
              Create Homework
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpen className="h-5 w-5 mr-2" />
              Add Course Content
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              Enter Grades
            </button>
          </div>
        </div>

        {/* My Classes */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { class: 'Class 10-A', subject: 'Mathematics', students: 40, attendance: '95%' },
              { class: 'Class 10-B', subject: 'Mathematics', students: 38, attendance: '92%' },
              { class: 'Class 9-A', subject: 'Mathematics', students: 42, attendance: '89%' },
            ].map((cls, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{cls.class}</h4>
                <p className="text-sm text-gray-600">{cls.subject}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-500">{cls.students} students</span>
                  <span className="text-green-600 font-medium">{cls.attendance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
