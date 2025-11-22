'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Classes', value: '12', icon: AcademicCapIcon, color: 'bg-blue-500' },
  { name: 'Pending Homework', value: '8', icon: ClipboardDocumentListIcon, color: 'bg-yellow-500' },
  { name: 'Students', value: '456', icon: UserGroupIcon, color: 'bg-green-500' },
  { name: 'Attendance Today', value: '95%', icon: CalendarIcon, color: 'bg-purple-500' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your school activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New homework assigned</p>
                    <p className="text-sm text-gray-600">Mathematics - Chapter 5</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Attendance marked</p>
                    <p className="text-sm text-gray-600">Class 10A - Present: 28/30</p>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quiz completed</p>
                    <p className="text-sm text-gray-600">Science - Quiz 3</p>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Parent-Teacher Meeting</p>
                    <p className="text-sm text-gray-600">All classes</p>
                  </div>
                  <span className="text-xs text-gray-500">Tomorrow</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mid-term Exams</p>
                    <p className="text-sm text-gray-600">Grades 9-12</p>
                  </div>
                  <span className="text-xs text-gray-500">Next week</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sports Day</p>
                    <p className="text-sm text-gray-600">All students</p>
                  </div>
                  <span className="text-xs text-gray-500">2 weeks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
