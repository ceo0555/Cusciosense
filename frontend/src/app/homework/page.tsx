'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function HomeworkPage() {
  const [activeTab, setActiveTab] = useState('all');

  const homeworkList = [
    {
      id: 1,
      title: 'Algebra Problems Set 1',
      subject: 'Mathematics',
      class: 'Grade 10-A',
      dueDate: '2024-12-25',
      status: 'pending',
      submissions: 25,
      total: 30,
    },
    {
      id: 2,
      title: 'Essay on Climate Change',
      subject: 'English',
      class: 'Grade 10-A',
      dueDate: '2024-12-20',
      status: 'submitted',
      submissions: 30,
      total: 30,
    },
    {
      id: 3,
      title: 'Chemical Reactions Lab Report',
      subject: 'Chemistry',
      class: 'Grade 10-B',
      dueDate: '2024-12-28',
      status: 'graded',
      submissions: 28,
      total: 30,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Homework</h1>
            <p className="text-gray-600 mt-1">Manage assignments and submissions</p>
          </div>
          <button className="btn btn-primary">
            ➕ Create Homework
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'submitted', 'graded'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Homework List */}
        <div className="grid gap-6">
          {homeworkList.map((homework) => (
            <div key={homework.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {homework.title}
                    </h3>
                    <span
                      className={`badge ${
                        homework.status === 'pending'
                          ? 'badge-warning'
                          : homework.status === 'submitted'
                          ? 'badge-primary'
                          : 'badge-success'
                      }`}
                    >
                      {homework.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>📚 {homework.subject}</span>
                    <span>🏫 {homework.class}</span>
                    <span>📅 Due: {homework.dueDate}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(homework.submissions / homework.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {homework.submissions}/{homework.total} submitted
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex space-x-2">
                  <button className="btn btn-secondary text-sm">View</button>
                  <button className="btn btn-primary text-sm">Grade</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
