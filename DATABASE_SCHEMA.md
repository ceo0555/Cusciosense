# Alfanumrik SchoolOS - Database Schema

## Entity Relationship Overview

```
User (Super Admin, School Admin, Teacher, Student, Parent)
  │
  ├── School (Multi-tenant)
  │     ├── AcademicYear
  │     ├── Class
  │     │    ├── Section
  │     │    ├── Subject
  │     │    ├── Timetable
  │     │    └── Course
  │     ├── Staff
  │     ├── Admission
  │     ├── Fee
  │     └── Payment
  │
  ├── Attendance
  ├── Homework
  │    └── HomeworkSubmission
  ├── Quiz
  │    └── QuizAttempt
  ├── Exam
  │    └── ExamResult
  ├── ReportCard
  └── Notification
```

## Detailed Schema

### 1. User Management

#### users
```sql
- id: UUID (PK)
- email: VARCHAR (UNIQUE)
- phone: VARCHAR (UNIQUE, NULLABLE)
- password_hash: VARCHAR
- first_name: VARCHAR
- last_name: VARCHAR
- role: ENUM (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT)
- avatar_url: VARCHAR (NULLABLE)
- is_active: BOOLEAN (DEFAULT true)
- is_email_verified: BOOLEAN (DEFAULT false)
- is_phone_verified: BOOLEAN (DEFAULT false)
- last_login_at: TIMESTAMP (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- deleted_at: TIMESTAMP (NULLABLE - soft delete)
```

### 2. School Management

#### schools
```sql
- id: UUID (PK)
- name: VARCHAR
- code: VARCHAR (UNIQUE)
- email: VARCHAR
- phone: VARCHAR
- address: TEXT
- city: VARCHAR
- state: VARCHAR
- country: VARCHAR (DEFAULT 'India')
- pincode: VARCHAR
- logo_url: VARCHAR (NULLABLE)
- website: VARCHAR (NULLABLE)
- established_year: INTEGER
- board: ENUM (CBSE, ICSE, STATE, IB, etc.)
- subscription_plan: ENUM (FREE, BASIC, PREMIUM, ENTERPRISE)
- subscription_status: ENUM (ACTIVE, INACTIVE, TRIAL, EXPIRED)
- subscription_expires_at: TIMESTAMP (NULLABLE)
- is_active: BOOLEAN (DEFAULT true)
- created_by_id: UUID (FK -> users.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### school_admins (Junction table)
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- user_id: UUID (FK -> users.id)
- created_at: TIMESTAMP
- UNIQUE(school_id, user_id)
```

#### staff
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- school_id: UUID (FK -> schools.id)
- staff_type: ENUM (TEACHER, ADMIN_STAFF, SUPPORT_STAFF)
- employee_id: VARCHAR (UNIQUE within school)
- department: VARCHAR (NULLABLE)
- designation: VARCHAR
- joining_date: DATE
- salary: DECIMAL (NULLABLE)
- qualification: TEXT (NULLABLE)
- experience_years: INTEGER (DEFAULT 0)
- subjects: JSONB (NULLABLE - array of subjects)
- is_active: BOOLEAN (DEFAULT true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 3. Academic Structure

#### academic_years
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- name: VARCHAR (e.g., "2024-2025")
- start_date: DATE
- end_date: DATE
- is_current: BOOLEAN (DEFAULT false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### classes
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- academic_year_id: UUID (FK -> academic_years.id)
- name: VARCHAR (e.g., "Class 10")
- grade: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### sections
```sql
- id: UUID (PK)
- class_id: UUID (FK -> classes.id)
- name: VARCHAR (e.g., "A", "B")
- teacher_id: UUID (FK -> staff.id - class teacher)
- room_number: VARCHAR (NULLABLE)
- capacity: INTEGER (DEFAULT 40)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### subjects
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- class_id: UUID (FK -> classes.id)
- name: VARCHAR
- code: VARCHAR
- description: TEXT (NULLABLE)
- teacher_id: UUID (FK -> staff.id)
- credit_hours: INTEGER (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### timetables
```sql
- id: UUID (PK)
- section_id: UUID (FK -> sections.id)
- subject_id: UUID (FK -> subjects.id)
- day_of_week: ENUM (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY)
- start_time: TIME
- end_time: TIME
- room_number: VARCHAR (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 4. Student Management

#### students
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- school_id: UUID (FK -> schools.id)
- section_id: UUID (FK -> sections.id)
- admission_number: VARCHAR (UNIQUE)
- roll_number: VARCHAR
- date_of_birth: DATE
- gender: ENUM (MALE, FEMALE, OTHER)
- blood_group: VARCHAR (NULLABLE)
- address: TEXT
- parent_id: UUID (FK -> users.id - parent user)
- admission_date: DATE
- status: ENUM (ACTIVE, INACTIVE, TRANSFERRED, ALUMNI)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### admissions
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- student_name: VARCHAR
- parent_name: VARCHAR
- parent_email: VARCHAR
- parent_phone: VARCHAR
- class_applying_for: VARCHAR
- date_of_birth: DATE
- previous_school: VARCHAR (NULLABLE)
- status: ENUM (PENDING, APPROVED, REJECTED, WAITLISTED)
- application_date: DATE
- remarks: TEXT (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 5. Attendance

#### attendance
```sql
- id: UUID (PK)
- student_id: UUID (FK -> students.id)
- section_id: UUID (FK -> sections.id)
- date: DATE
- status: ENUM (PRESENT, ABSENT, LATE, HALF_DAY, HOLIDAY)
- marked_by_id: UUID (FK -> users.id)
- remarks: TEXT (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(student_id, date)
```

### 6. LMS - Course Content

#### courses
```sql
- id: UUID (PK)
- subject_id: UUID (FK -> subjects.id)
- title: VARCHAR
- description: TEXT
- sequence_order: INTEGER
- is_published: BOOLEAN (DEFAULT false)
- created_by_id: UUID (FK -> users.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### course_content
```sql
- id: UUID (PK)
- course_id: UUID (FK -> courses.id)
- title: VARCHAR
- content_type: ENUM (VIDEO, DOCUMENT, PDF, LINK, TEXT)
- content_url: VARCHAR (NULLABLE)
- content_text: TEXT (NULLABLE)
- duration_minutes: INTEGER (NULLABLE)
- sequence_order: INTEGER
- is_free: BOOLEAN (DEFAULT true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 7. Homework System

#### homework
```sql
- id: UUID (PK)
- subject_id: UUID (FK -> subjects.id)
- section_id: UUID (FK -> sections.id)
- title: VARCHAR
- description: TEXT
- due_date: TIMESTAMP
- max_marks: INTEGER
- attachment_url: VARCHAR (NULLABLE)
- created_by_id: UUID (FK -> staff.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### homework_submissions
```sql
- id: UUID (PK)
- homework_id: UUID (FK -> homework.id)
- student_id: UUID (FK -> students.id)
- submission_type: ENUM (TEXT, DRAWING, IMAGE, PDF, MIXED)
- text_content: TEXT (NULLABLE)
- drawing_data: JSONB (NULLABLE - canvas drawing data)
- attachments: JSONB (NULLABLE - array of file URLs)
- submitted_at: TIMESTAMP
- marks_obtained: DECIMAL (NULLABLE)
- feedback: TEXT (NULLABLE)
- graded_by_id: UUID (FK -> staff.id, NULLABLE)
- graded_at: TIMESTAMP (NULLABLE)
- status: ENUM (PENDING, SUBMITTED, GRADED, LATE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 8. Quizzes

#### quizzes
```sql
- id: UUID (PK)
- subject_id: UUID (FK -> subjects.id)
- section_id: UUID (FK -> sections.id)
- title: VARCHAR
- description: TEXT (NULLABLE)
- duration_minutes: INTEGER
- total_marks: INTEGER
- passing_marks: INTEGER
- questions: JSONB (array of question objects)
- start_time: TIMESTAMP
- end_time: TIMESTAMP
- is_published: BOOLEAN (DEFAULT false)
- created_by_id: UUID (FK -> staff.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### quiz_attempts
```sql
- id: UUID (PK)
- quiz_id: UUID (FK -> quizzes.id)
- student_id: UUID (FK -> students.id)
- answers: JSONB (array of answer objects)
- marks_obtained: DECIMAL
- started_at: TIMESTAMP
- submitted_at: TIMESTAMP
- time_taken_minutes: INTEGER
- status: ENUM (IN_PROGRESS, SUBMITTED, EVALUATED)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 9. Exams & Results

#### exams
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- academic_year_id: UUID (FK -> academic_years.id)
- name: VARCHAR (e.g., "Mid-term", "Final")
- exam_type: ENUM (UNIT_TEST, MIDTERM, FINAL, BOARD)
- start_date: DATE
- end_date: DATE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### exam_schedules
```sql
- id: UUID (PK)
- exam_id: UUID (FK -> exams.id)
- subject_id: UUID (FK -> subjects.id)
- section_id: UUID (FK -> sections.id)
- exam_date: DATE
- start_time: TIME
- end_time: TIME
- max_marks: INTEGER
- room_number: VARCHAR (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### exam_results
```sql
- id: UUID (PK)
- exam_schedule_id: UUID (FK -> exam_schedules.id)
- student_id: UUID (FK -> students.id)
- marks_obtained: DECIMAL
- grade: VARCHAR (NULLABLE)
- remarks: TEXT (NULLABLE)
- entered_by_id: UUID (FK -> staff.id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(exam_schedule_id, student_id)
```

#### report_cards
```sql
- id: UUID (PK)
- student_id: UUID (FK -> students.id)
- exam_id: UUID (FK -> exams.id)
- total_marks_obtained: DECIMAL
- total_max_marks: DECIMAL
- percentage: DECIMAL
- grade: VARCHAR
- rank: INTEGER (NULLABLE)
- attendance_percentage: DECIMAL
- remarks: TEXT (NULLABLE)
- pdf_url: VARCHAR (NULLABLE)
- generated_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 10. Fee Management

#### fee_structures
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- class_id: UUID (FK -> classes.id)
- academic_year_id: UUID (FK -> academic_years.id)
- fee_type: ENUM (TUITION, TRANSPORT, LIBRARY, LAB, SPORTS, MISC)
- amount: DECIMAL
- due_date: DATE
- description: TEXT (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### fee_payments
```sql
- id: UUID (PK)
- student_id: UUID (FK -> students.id)
- fee_structure_id: UUID (FK -> fee_structures.id)
- amount: DECIMAL
- payment_method: ENUM (CASH, CARD, UPI, BANK_TRANSFER, ONLINE)
- payment_status: ENUM (PENDING, PAID, PARTIAL, OVERDUE)
- transaction_id: VARCHAR (NULLABLE)
- payment_date: DATE (NULLABLE)
- receipt_number: VARCHAR (UNIQUE, NULLABLE)
- remarks: TEXT (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 11. Subscription & Payments (for schools)

#### subscriptions
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- plan: ENUM (FREE, BASIC, PREMIUM, ENTERPRISE)
- billing_cycle: ENUM (MONTHLY, QUARTERLY, YEARLY)
- amount: DECIMAL
- start_date: DATE
- end_date: DATE
- status: ENUM (ACTIVE, CANCELLED, EXPIRED, TRIAL)
- razorpay_subscription_id: VARCHAR (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### payments
```sql
- id: UUID (PK)
- school_id: UUID (FK -> schools.id)
- subscription_id: UUID (FK -> subscriptions.id)
- amount: DECIMAL
- currency: VARCHAR (DEFAULT 'INR')
- razorpay_order_id: VARCHAR
- razorpay_payment_id: VARCHAR (NULLABLE)
- razorpay_signature: VARCHAR (NULLABLE)
- status: ENUM (PENDING, SUCCESS, FAILED, REFUNDED)
- payment_date: TIMESTAMP (NULLABLE)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 12. Notifications

#### notifications
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- title: VARCHAR
- message: TEXT
- type: ENUM (INFO, WARNING, SUCCESS, ERROR, ANNOUNCEMENT)
- category: ENUM (ACADEMIC, FEE, ATTENDANCE, HOMEWORK, EXAM, GENERAL)
- is_read: BOOLEAN (DEFAULT false)
- link: VARCHAR (NULLABLE)
- metadata: JSONB (NULLABLE)
- created_at: TIMESTAMP
- read_at: TIMESTAMP (NULLABLE)
```

#### email_logs
```sql
- id: UUID (PK)
- to_email: VARCHAR
- subject: VARCHAR
- body: TEXT
- status: ENUM (PENDING, SENT, FAILED)
- error_message: TEXT (NULLABLE)
- sent_at: TIMESTAMP (NULLABLE)
- created_at: TIMESTAMP
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_students_school_section ON students(school_id, section_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id, date);
CREATE INDEX idx_homework_section_due ON homework(section_id, due_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
```

## Database Views

### student_performance_summary
```sql
CREATE VIEW student_performance_summary AS
SELECT 
  s.id as student_id,
  s.admission_number,
  u.first_name,
  u.last_name,
  sec.name as section,
  c.name as class,
  AVG(er.marks_obtained / es.max_marks * 100) as average_percentage,
  COUNT(DISTINCT hw.id) as total_homework_assigned,
  COUNT(DISTINCT hws.id) as homework_submitted,
  COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as days_present,
  COUNT(a.id) as total_days
FROM students s
JOIN users u ON s.user_id = u.id
JOIN sections sec ON s.section_id = sec.id
JOIN classes c ON sec.class_id = c.id
LEFT JOIN exam_results er ON s.id = er.student_id
LEFT JOIN exam_schedules es ON er.exam_schedule_id = es.id
LEFT JOIN homework hw ON sec.id = hw.section_id
LEFT JOIN homework_submissions hws ON hw.id = hws.homework_id AND s.id = hws.student_id
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.admission_number, u.first_name, u.last_name, sec.name, c.name;
```

## Data Relationships Summary

- One School has many Users (admins, teachers, students)
- One School has many Classes
- One Class has many Sections
- One Section has many Students
- One Section has many Subjects
- One Subject has many Courses
- One Course has many Content items
- One Subject has many Homework assignments
- One Homework has many Submissions
- One Student has many Attendance records
- One Student has many Exam Results
- One Student has many Fee Payments
- One User has many Notifications
