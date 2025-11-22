# Database Schema - Alfanumrik SchoolOS

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   schools   │◄────────│    users     │────────►│   roles     │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        ├──────────────────────┐
      │                        │                      │
      ▼                        ▼                      ▼
┌─────────────┐         ┌──────────────┐      ┌─────────────┐
│  academic   │         │   students   │      │  teachers   │
│   years     │         └──────────────┘      └─────────────┘
└─────────────┘                │                     │
      │                        │                     │
      ▼                        ▼                     ▼
┌─────────────┐         ┌──────────────┐      ┌─────────────┐
│   classes   │◄────────│  enrollments │      │   subjects  │
└─────────────┘         └──────────────┘      └─────────────┘
      │                                              │
      │                                              │
      ├──────────────┬───────────────┬──────────────┤
      │              │               │              │
      ▼              ▼               ▼              ▼
┌──────────┐  ┌──────────┐   ┌──────────┐   ┌──────────┐
│timetable │  │attendance│   │ homework │   │  exams   │
└──────────┘  └──────────┘   └──────────┘   └──────────┘
                                    │              │
                                    ▼              ▼
                             ┌──────────┐   ┌──────────┐
                             │submissions│  │  grades  │
                             └──────────┘   └──────────┘
```

## Tables

### 1. users
Core user table for all user types in the system.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_school ON users(school_id);
```

### 2. roles
Defines user roles and permissions.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name, slug, description, permissions) VALUES
('Super Admin', 'super_admin', 'Full system access', '["*"]'),
('School Admin', 'school_admin', 'School management access', '["school.*", "users.*", "students.*", "teachers.*"]'),
('Teacher', 'teacher', 'Teaching and grading access', '["courses.*", "homework.*", "grades.*", "attendance.*"]'),
('Student', 'student', 'Learning access', '["courses.view", "homework.submit", "grades.view"]'),
('Parent', 'parent', 'Monitoring access', '["students.view", "grades.view", "attendance.view", "fees.pay"]');
```

### 3. schools
School/Institution information.

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  logo_url VARCHAR(500),
  website VARCHAR(255),
  established_year INTEGER,
  board VARCHAR(50), -- CBSE, ICSE, State Board, etc.
  subscription_status VARCHAR(20) DEFAULT 'trial', -- trial, active, suspended, cancelled
  subscription_plan VARCHAR(50), -- basic, premium, enterprise
  subscription_start_date DATE,
  subscription_end_date DATE,
  max_students INTEGER DEFAULT 100,
  max_teachers INTEGER DEFAULT 10,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_subscription ON schools(subscription_status);
```

### 4. academic_years
Academic year definitions.

```sql
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- "2024-2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_academic_years_school ON academic_years(school_id);
CREATE INDEX idx_academic_years_current ON academic_years(school_id, is_current);
```

### 5. classes
Classes/Grades in the school.

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- "Grade 1", "Class 10A", etc.
  grade_level INTEGER NOT NULL, -- 1-12
  section VARCHAR(10), -- A, B, C, etc.
  class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  room_number VARCHAR(50),
  max_students INTEGER DEFAULT 40,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year_id);
CREATE INDEX idx_classes_teacher ON classes(class_teacher_id);
```

### 6. subjects
Subjects taught in the school.

```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- Mathematics, Science, etc.
  code VARCHAR(20) UNIQUE,
  description TEXT,
  grade_level INTEGER, -- NULL means all grades
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subjects_school ON subjects(school_id);
CREATE INDEX idx_subjects_grade ON subjects(grade_level);
```

### 7. students
Student-specific information.

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  admission_number VARCHAR(50) UNIQUE NOT NULL,
  admission_date DATE NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  address TEXT,
  parent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relation VARCHAR(50),
  medical_conditions TEXT,
  profile_photo_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, alumni
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_admission ON students(admission_number);
CREATE INDEX idx_students_parent ON students(parent_id);
```

### 8. teachers
Teacher-specific information.

```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  joining_date DATE NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  qualification VARCHAR(255),
  specialization VARCHAR(255),
  experience_years INTEGER,
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active', -- active, on_leave, resigned
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE INDEX idx_teachers_employee ON teachers(employee_id);
```

### 9. enrollments
Student enrollment in classes.

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  roll_number INTEGER,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, dropped
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, class_id, academic_year_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_academic_year ON enrollments(academic_year_id);
```

### 10. subject_assignments
Teacher-subject-class assignments.

```sql
CREATE TABLE subject_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year_id)
);

CREATE INDEX idx_subject_assignments_teacher ON subject_assignments(teacher_id);
CREATE INDEX idx_subject_assignments_subject ON subject_assignments(subject_id);
CREATE INDEX idx_subject_assignments_class ON subject_assignments(class_id);
```

### 11. courses
LMS Courses/Content.

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  objectives TEXT[],
  thumbnail_url VARCHAR(500),
  duration_minutes INTEGER,
  difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_school ON courses(school_id);
CREATE INDEX idx_courses_subject ON courses(subject_id);
CREATE INDEX idx_courses_class ON courses(class_id);
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
```

### 12. course_materials
Course learning materials.

```sql
CREATE TABLE course_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- video, pdf, document, link, quiz
  content_url VARCHAR(500),
  file_size BIGINT,
  duration_minutes INTEGER,
  order_index INTEGER DEFAULT 0,
  is_downloadable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_course_materials_course ON course_materials(course_id);
```

### 13. homework
Homework assignments.

```sql
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date TIMESTAMP NOT NULL,
  max_marks INTEGER DEFAULT 100,
  allow_late_submission BOOLEAN DEFAULT false,
  submission_type VARCHAR(50)[], -- text, image, pdf, drawing
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_homework_school ON homework(school_id);
CREATE INDEX idx_homework_class ON homework(class_id);
CREATE INDEX idx_homework_subject ON homework(subject_id);
CREATE INDEX idx_homework_teacher ON homework(teacher_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
```

### 14. homework_submissions
Student homework submissions.

```sql
CREATE TABLE homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_files JSONB DEFAULT '[]', -- Array of file URLs
  drawing_data TEXT, -- SVG or canvas data
  submitted_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- pending, submitted, graded, late
  marks_obtained DECIMAL(5,2),
  feedback TEXT,
  graded_by UUID REFERENCES teachers(id),
  graded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX idx_submissions_student ON homework_submissions(student_id);
CREATE INDEX idx_submissions_status ON homework_submissions(status);
```

### 15. exams
Exam definitions.

```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exam_type VARCHAR(50) NOT NULL, -- unit_test, mid_term, final, practical
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exams_school ON exams(school_id);
CREATE INDEX idx_exams_academic_year ON exams(academic_year_id);
CREATE INDEX idx_exams_dates ON exams(start_date, end_date);
```

### 16. exam_schedules
Individual exam schedule entries.

```sql
CREATE TABLE exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(50),
  max_marks INTEGER NOT NULL DEFAULT 100,
  min_passing_marks INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exam_schedules_exam ON exam_schedules(exam_id);
CREATE INDEX idx_exam_schedules_class ON exam_schedules(class_id);
CREATE INDEX idx_exam_schedules_subject ON exam_schedules(subject_id);
```

### 17. grades
Student grades/marks.

```sql
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_schedule_id UUID NOT NULL REFERENCES exam_schedules(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(5,2) NOT NULL,
  is_absent BOOLEAN DEFAULT false,
  remarks TEXT,
  entered_by UUID NOT NULL REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(exam_schedule_id, student_id)
);

CREATE INDEX idx_grades_exam_schedule ON grades(exam_schedule_id);
CREATE INDEX idx_grades_student ON grades(student_id);
```

### 18. attendance
Daily attendance records.

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- present, absent, late, half_day, sick_leave, authorized_leave
  remarks TEXT,
  marked_by UUID NOT NULL REFERENCES teachers(id),
  marked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_school ON attendance(school_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### 19. timetable
Class timetable/schedule.

```sql
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(50),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_timetable_school ON timetable(school_id);
CREATE INDEX idx_timetable_class ON timetable(class_id);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
```

### 20. fee_structures
Fee structure templates.

```sql
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE, -- NULL means all classes
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- one_time, monthly, quarterly, annually
  due_date DATE,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_school ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_academic_year ON fee_structures(academic_year_id);
CREATE INDEX idx_fee_structures_class ON fee_structures(class_id);
```

### 21. student_fees
Student-specific fee records.

```sql
CREATE TABLE student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  late_fee DECIMAL(10,2) DEFAULT 0,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid, overdue, waived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_student_fees_student ON student_fees(student_id);
CREATE INDEX idx_student_fees_structure ON student_fees(fee_structure_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);
```

### 22. payments
Payment transactions.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES users(id),
  payment_type VARCHAR(50) NOT NULL, -- student_fee, subscription
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50), -- razorpay, cash, cheque, bank_transfer
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, success, failed, refunded
  paid_at TIMESTAMP,
  receipt_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay ON payments(razorpay_payment_id);
```

### 23. payment_items
Individual items in a payment.

```sql
CREATE TABLE payment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  student_fee_id UUID REFERENCES student_fees(id),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_items_payment ON payment_items(payment_id);
CREATE INDEX idx_payment_items_student_fee ON payment_items(student_fee_id);
```

### 24. notifications
System notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- info, success, warning, error, homework, exam, fee, attendance
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

### 25. announcements
School-wide or class-specific announcements.

```sql
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(50) NOT NULL, -- all, teachers, students, parents, class_specific
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_announcements_school ON announcements(school_id);
CREATE INDEX idx_announcements_class ON announcements(class_id);
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at);
```

### 26. quizzes
Quiz/Test definitions.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  passing_marks INTEGER NOT NULL DEFAULT 40,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  is_published BOOLEAN DEFAULT false,
  shuffle_questions BOOLEAN DEFAULT false,
  show_results BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_class ON quizzes(class_id);
CREATE INDEX idx_quizzes_subject ON quizzes(subject_id);
```

### 27. quiz_questions
Quiz questions.

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- mcq, true_false, short_answer, long_answer
  options JSONB, -- For MCQ questions
  correct_answer TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
```

### 28. quiz_attempts
Student quiz attempts.

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMP,
  score DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, submitted, graded
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
```

### 29. admissions
Admission applications.

```sql
CREATE TABLE admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  parent_name VARCHAR(100) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  previous_school VARCHAR(255),
  documents JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, waitlist
  application_date DATE DEFAULT CURRENT_DATE,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admissions_school ON admissions(school_id);
CREATE INDEX idx_admissions_academic_year ON admissions(academic_year_id);
CREATE INDEX idx_admissions_status ON admissions(status);
```

### 30. refresh_tokens
JWT refresh tokens for authentication.

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

## Relationships Summary

1. **users** ↔ **roles**: Many-to-One (Each user has one role)
2. **users** ↔ **schools**: Many-to-One (Each user belongs to one school, except super admin)
3. **schools** ↔ **academic_years**: One-to-Many
4. **schools** ↔ **classes**: One-to-Many
5. **academic_years** ↔ **classes**: One-to-Many
6. **classes** ↔ **enrollments**: One-to-Many
7. **students** ↔ **enrollments**: One-to-Many
8. **classes** ↔ **homework**: One-to-Many
9. **homework** ↔ **homework_submissions**: One-to-Many
10. **students** ↔ **homework_submissions**: One-to-Many
11. **classes** ↔ **courses**: One-to-Many
12. **subjects** ↔ **courses**: One-to-Many
13. **exams** ↔ **exam_schedules**: One-to-Many
14. **exam_schedules** ↔ **grades**: One-to-Many
15. **students** ↔ **attendance**: One-to-Many
16. **classes** ↔ **timetable**: One-to-Many
17. **students** ↔ **student_fees**: One-to-Many
18. **payments** ↔ **payment_items**: One-to-Many

## Sample Data Requirements

- 1 Super Admin user
- Multiple schools
- Each school has:
  - 1 School Admin
  - Multiple Teachers (5-20)
  - Multiple Students (50-500)
  - Multiple Classes (5-15)
  - Multiple Subjects (8-15)
  - Current Academic Year
  - Fee Structures
