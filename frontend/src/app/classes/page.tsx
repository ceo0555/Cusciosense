'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ClassesPage() {
  const classes = [
    { id: 1, name: 'Grade 10', section: 'A', students: 30, teacher: 'John Doe', subjects: 8 },
    { id: 2, name: 'Grade 10', section: 'B', students: 28, teacher: 'Jane Smith', subjects: 8 },
    { id: 3, name: 'Grade 9', section: 'A', students: 32, teacher: 'Mike Johnson', subjects: 7 },
    { id: 4, name: 'Grade 9', section: 'B', students: 30, teacher: 'Sarah Williams', subjects: 7 },
    { id: 5, name: 'Grade 8', section: 'A', students: 35, teacher: 'David Brown', subjects: 7 },
    { id: 6, name: 'Grade 8', section: 'B', students: 33, teacher: 'Emily Davis', subjects: 7 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-1">Manage classes and sections</p>
          </div>
          <button className="btn btn-primary">
            ➕ Add Class
          </button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {classItem.name} - {classItem.section}
                </h3>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="text-xl mr-2">👨‍🏫</span>
                  <span className="text-sm">{classItem.teacher}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="text-xl mr-2">👨‍🎓</span>
                    <span>{classItem.students} Students</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-xl mr-2">📚</span>
                    <span>{classItem.subjects} Subjects</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex space-x-2">
                  <button className="flex-1 btn btn-secondary text-sm">
                    View Details
                  </button>
                  <button className="flex-1 btn btn-primary text-sm">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
