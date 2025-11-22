'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { cn } from '@/utils/cn'
import {
  BookOpen,
  Home,
  Users,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  BookMarked,
  FileText,
  DollarSign,
  Settings,
  Bell,
  LogOut,
  BarChart,
  School,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Schools',
    href: '/admin/schools',
    icon: <School className="h-5 w-5" />,
    roles: ['super_admin'],
  },
  {
    name: 'Students',
    href: '/admin/students',
    icon: <Users className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher'],
  },
  {
    name: 'Teachers',
    href: '/admin/teachers',
    icon: <GraduationCap className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin'],
  },
  {
    name: 'Classes',
    href: '/admin/classes',
    icon: <BookMarked className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher'],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: <ClipboardCheck className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Timetable',
    href: '/timetable',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student'],
  },
  {
    name: 'Homework',
    href: '/homework',
    icon: <FileText className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Exams & Grades',
    href: '/exams',
    icon: <BarChart className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Fees & Payments',
    href: '/fees',
    icon: <DollarSign className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'parent'],
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: <Bell className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavItems = navigationItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  )

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <BookOpen className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">SchoolOS</span>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  )
}
