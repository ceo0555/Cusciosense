export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePictureUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive: boolean;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  board?: string;
  affiliationNumber?: string;
  establishedYear?: number;
  isActive: boolean;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: number;
  section?: string;
  academicYear: string;
  classTeacherId?: string;
  roomNumber?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  classId: string;
  name: string;
  code?: string;
  description?: string;
  teacherId?: string;
  syllabusUrl?: string;
  credits?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Homework {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  instructions?: string;
  dueDate: string;
  totalMarks?: number;
  allowLateSubmission: boolean;
  submissionTypes?: string[];
  attachments?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionText?: string;
  submissionFiles?: string[];
  drawingData?: string;
  submittedAt?: string;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  marksObtained?: number;
  feedback?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
