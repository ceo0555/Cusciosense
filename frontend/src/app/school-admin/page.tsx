'use client'

import DashboardLayout from '@/components/Layout/DashboardLayout'
import { Users, BookOpen, DollarSign, TrendingUp, UserCheck, GraduationCap } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/school-admin', icon: TrendingUp },
  { name: 'Students', href: '/school-admin/students', icon: Users },
  { name: 'Staff', href: '/school-admin/staff', icon: UserCheck },
  { name: 'Classes', href: '/school-admin/classes', icon: BookOpen },
  { name: 'Admissions', href: '/school-admin/admissions', icon: GraduationCap },
  { name: 'Fees', href: '/school-admin/fees', icon: DollarSign },
]

export default function SchoolAdminDashboard() {
  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your school operations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">485</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12 this month</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">24 teachers, 4 staff</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fee Collection</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₹45L</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">90% collected</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">92.3%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This week</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Admissions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Admissions</h3>
              <span className="badge badge-warning">12 pending</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'John Doe', class: 'Class 10', date: '2 days ago' },
                { name: 'Jane Smith', class: 'Class 9', date: '3 days ago' },
                { name: 'Mike Johnson', class: 'Class 8', date: '5 days ago' },
              ].map((admission, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{admission.name}</p>
                    <p className="text-sm text-gray-600">{admission.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{admission.date}</p>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Defaulters */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fee Defaulters</h3>
              <span className="badge badge-danger">8 overdue</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Student A', amount: '₹25,000', overdue: '15 days' },
                { name: 'Student B', amount: '₹18,000', overdue: '10 days' },
                { name: 'Student C', amount: '₹30,000', overdue: '8 days' },
              ].map((defaulter, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{defaulter.name}</p>
                    <p className="text-sm text-gray-600">{defaulter.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">{defaulter.overdue} overdue</p>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Class Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { class: 'Class 10', sections: 2, students: 78, teachers: 6 },
              { class: 'Class 9', sections: 2, students: 82, teachers: 6 },
              { class: 'Class 8', sections: 3, students: 115, teachers: 7 },
              { class: 'Class 7', sections: 3, students: 120, teachers: 7 },
            ].map((cls, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{cls.class}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{cls.sections} Sections</p>
                  <p className="text-gray-600">{cls.students} Students</p>
                  <p className="text-gray-600">{cls.teachers} Teachers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
