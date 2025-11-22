// User & Auth Types
export interface User {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  role: UserRole
  school?: School
  avatarUrl?: string
  isActive: boolean
  isVerified: boolean
}

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent'

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  phone?: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  schoolId?: string
}

// School Types
export interface School {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  country?: string
  logoUrl?: string
  board?: string
  subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled'
  subscriptionPlan?: string
  maxStudents: number
  maxTeachers: number
}

// Student Types
export interface Student {
  id: string
  userId: string
  user: User
  schoolId: string
  admissionNumber: string
  admissionDate: string
  dateOfBirth: string
  gender?: string
  bloodGroup?: string
  currentClass?: Class
  parent?: User
  status: 'active' | 'suspended' | 'alumni'
}

// Teacher Types
export interface Teacher {
  id: string
  userId: string
  user: User
  schoolId: string
  employeeId: string
  joiningDate: string
  qualification?: string
  specialization?: string
  experienceYears?: number
  status: 'active' | 'on_leave' | 'resigned'
}

// Class Types
export interface Class {
  id: string
  schoolId: string
  academicYearId: string
  name: string
  gradeLevel: number
  section?: string
  classTeacher?: Teacher
  roomNumber?: string
  maxStudents: number
  currentStudents: number
}

// Subject Types
export interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  description?: string
  gradeLevel?: number
}

// Homework Types
export interface Homework {
  id: string
  schoolId: string
  classId: string
  subjectId: string
  teacherId: string
  class: Class
  subject: Subject
  teacher: Teacher
  title: string
  description?: string
  instructions?: string
  dueDate: string
  maxMarks: number
  allowLateSubmission: boolean
  submissionType: ('text' | 'image' | 'pdf' | 'drawing')[]
  attachments?: Attachment[]
  submissionStats?: {
    total: number
    submitted: number
    pending: number
    graded: number
  }
  createdAt: string
}

export interface HomeworkSubmission {
  id: string
  homeworkId: string
  studentId: string
  student?: Student
  submissionText?: string
  submissionFiles?: Attachment[]
  drawingData?: string
  submittedAt?: string
  status: 'pending' | 'submitted' | 'graded' | 'late'
  marksObtained?: number
  feedback?: string
  gradedBy?: string
  gradedAt?: string
}

// Exam Types
export interface Exam {
  id: string
  schoolId: string
  academicYearId: string
  name: string
  examType: 'unit_test' | 'mid_term' | 'final' | 'practical'
  startDate: string
  endDate: string
  description?: string
}

export interface Grade {
  id: string
  examScheduleId: string
  studentId: string
  student?: Student
  marksObtained: number
  isAbsent: boolean
  remarks?: string
}

// Attendance Types
export interface Attendance {
  id: string
  schoolId: string
  classId: string
  studentId: string
  student?: Student
  date: string
  status: 'present' | 'absent' | 'late' | 'half_day' | 'sick_leave' | 'authorized_leave'
  remarks?: string
  markedBy: string
}

// Course Types
export interface Course {
  id: string
  schoolId: string
  subjectId: string
  classId: string
  teacherId: string
  title: string
  description?: string
  content?: string
  objectives?: string[]
  thumbnailUrl?: string
  durationMinutes?: number
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  materials?: CourseMaterial[]
}

export interface CourseMaterial {
  id: string
  courseId: string
  title: string
  description?: string
  type: 'video' | 'pdf' | 'document' | 'link' | 'quiz'
  contentUrl?: string
  fileSize?: number
  durationMinutes?: number
  orderIndex: number
  isDownloadable: boolean
}

// Fee Types
export interface FeeStructure {
  id: string
  schoolId: string
  academicYearId: string
  classId?: string
  name: string
  description?: string
  amount: number
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually'
  dueDate?: string
  isMandatory: boolean
}

export interface StudentFee {
  id: string
  studentId: string
  feeStructureId: string
  feeStructure?: FeeStructure
  amountDue: number
  amountPaid: number
  discount: number
  lateFee: number
  dueDate: string
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'
}

export interface Payment {
  id: string
  schoolId: string
  payerId: string
  paymentType: 'student_fee' | 'subscription'
  amount: number
  currency: string
  paymentMethod?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  transactionId?: string
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'
  paidAt?: string
  receiptUrl?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'homework' | 'exam' | 'fee' | 'attendance'
  link?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// Common Types
export interface Attachment {
  name: string
  url: string
  size?: number
  type?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
  details?: any[]
}

// Dashboard Stats
export interface DashboardStats {
  role: UserRole
  stats: Record<string, number | string>
}
