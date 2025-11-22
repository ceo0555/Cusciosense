'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HomeworkPage() {
  const homework = [
    {
      id: 1,
      title: 'Mathematics Assignment',
      course: 'Mathematics',
      dueDate: '2024-01-25',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Science Lab Report',
      course: 'Science',
      dueDate: '2024-01-26',
      status: 'submitted',
    },
    {
      id: 3,
      title: 'English Essay',
      course: 'English',
      dueDate: '2024-01-27',
      status: 'graded',
    },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    graded: 'bg-green-100 text-green-800',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homework</h1>
            <p className="text-gray-600 mt-1">Manage your assignments</p>
          </div>
          <Button>Create New Assignment</Button>
        </div>

        <div className="grid gap-4">
          {homework.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.course}</p>
                  <p className="text-sm text-gray-500 mt-1">Due: {item.dueDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
