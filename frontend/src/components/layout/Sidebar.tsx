'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  UserGroupIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Classes', href: '/dashboard/classes', icon: AcademicCapIcon },
  { name: 'Homework', href: '/dashboard/homework', icon: ClipboardDocumentListIcon },
  { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarIcon },
  { name: 'Students', href: '/dashboard/students', icon: UserGroupIcon, roles: ['teacher', 'school_admin'] },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">SchoolOS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
