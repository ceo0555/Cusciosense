# Alfanumrik SchoolOS - Database Schema

## Entity Relationship Diagram (ERD)

```
┌────────────────┐          ┌────────────────┐          ┌────────────────┐
│     users      │──────────│     schools    │──────────│  subscriptions │
└────────────────┘   1:N    └────────────────┘   1:1    └────────────────┘
        │                           │
        │ 1:N                       │ 1:N
        │                           │
┌────────────────┐          ┌────────────────┐
│  user_roles    │          │    classes     │
└────────────────┘          └────────────────┘
                                    │
                                    │ 1:N
                                    │
                            ┌────────────────┐
                            │    courses     │
                            └────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │ 1:N           │ 1:N           │ 1:N
                    │               │               │
            ┌────────────┐  ┌────────────┐  ┌────────────┐
            │  homework  │  │   quizzes  │  │   content  │
            └────────────┘  └────────────┘  └────────────┘
                    │               │
                    │ 1:N           │ 1:N
                    │               │
        ┌──────────────────┐ ┌──────────────────┐
        │homework_submissions│ │ quiz_submissions │
        └──────────────────┘ └──────────────────┘
```

## Core Tables

### 1. users
User accounts for all role types (Super Admin, School Admin, Teacher, Student, Parent)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    profile_picture_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### 2. user_roles
Maps users to their roles and associated schools

```sql
CREATE TYPE user_role_enum AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent');

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_school_id ON user_roles(school_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
```

### 3. schools
School organizations

```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    logo_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    board VARCHAR(100), -- CBSE, ICSE, State Board, etc.
    affiliation_number VARCHAR(100),
    established_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, expired, cancelled
    settings JSONB, -- School-specific settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_schools_is_active ON schools(is_active);
```

### 4. subscriptions
School subscription and payment tracking

```sql
CREATE TYPE subscription_plan_enum AS ENUM ('basic', 'standard', 'premium', 'enterprise');

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    plan subscription_plan_enum NOT NULL,
    status VARCHAR(50) NOT NULL, -- active, expired, cancelled, suspended
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INTEGER,
    max_teachers INTEGER,
    amount_paid DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20), -- monthly, quarterly, yearly
    auto_renew BOOLEAN DEFAULT false,
    razorpay_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_school_id ON subscriptions(school_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 5. classes
Classes/Sections within schools

```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Class 10A"
    grade_level INTEGER NOT NULL, -- 1-12
    section VARCHAR(10), -- A, B, C
    academic_year VARCHAR(20) NOT NULL, -- 2024-2025
    class_teacher_id UUID REFERENCES users(id),
    room_number VARCHAR(50),
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_grade_level ON classes(grade_level);
CREATE INDEX idx_classes_class_teacher_id ON classes(class_teacher_id);
```

### 6. enrollments
Student enrollment in classes

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    roll_number VARCHAR(50),
    enrollment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, withdrawn, transferred
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, academic_year)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
```

### 7. parent_student_relations
Links parents to students

```sql
CREATE TABLE parent_student_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL, -- father, mother, guardian
    is_primary_contact BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_student_parent_id ON parent_student_relations(parent_id);
CREATE INDEX idx_parent_student_student_id ON parent_student_relations(student_id);
```

### 8. staff
Staff/Teacher employment details

```sql
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100), -- Principal, Vice Principal, Teacher, etc.
    department VARCHAR(100), -- Mathematics, Science, etc.
    qualification VARCHAR(255),
    experience_years INTEGER,
    joining_date DATE NOT NULL,
    leaving_date DATE,
    salary DECIMAL(10, 2),
    employment_type VARCHAR(50), -- full-time, part-time, contract
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_staff_school_id ON staff(school_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
```

## Academic Module Tables

### 9. courses
Courses/Subjects

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Mathematics, Science, etc.
    code VARCHAR(50),
    description TEXT,
    teacher_id UUID REFERENCES users(id),
    syllabus_url TEXT,
    credits INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_class_id ON courses(class_id);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
```

### 10. content
Learning content/materials

```sql
CREATE TYPE content_type_enum AS ENUM ('video', 'pdf', 'document', 'link', 'image', 'audio');

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type content_type_enum NOT NULL,
    file_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds for video/audio
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_course_id ON content(course_id);
CREATE INDEX idx_content_is_published ON content(is_published);
```

### 11. homework
Homework/Assignments

```sql
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP NOT NULL,
    total_marks DECIMAL(5, 2),
    allow_late_submission BOOLEAN DEFAULT false,
    submission_types JSONB, -- ['text', 'file', 'drawing']
    attachments JSONB, -- Array of file URLs
    created_by UUID REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_homework_course_id ON homework(course_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
```

### 12. homework_submissions
Student homework submissions

```sql
CREATE TYPE submission_status_enum AS ENUM ('draft', 'submitted', 'graded', 'returned');

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT,
    submission_files JSONB, -- Array of file URLs
    drawing_data TEXT, -- Canvas drawing data
    submitted_at TIMESTAMP,
    status submission_status_enum DEFAULT 'draft',
    marks_obtained DECIMAL(5, 2),
    feedback TEXT,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_homework_submissions_homework_id ON homework_submissions(homework_id);
CREATE INDEX idx_homework_submissions_student_id ON homework_submissions(student_id);
CREATE INDEX idx_homework_submissions_status ON homework_submissions(status);
```

### 13. quizzes
Quizzes and tests

```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    duration INTEGER, -- in minutes
    total_marks DECIMAL(5, 2),
    passing_marks DECIMAL(5, 2),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    shuffle_questions BOOLEAN DEFAULT false,
    show_results BOOLEAN DEFAULT true,
    attempts_allowed INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX idx_quizzes_start_time ON quizzes(start_time);
```

### 14. quiz_questions
Questions in quizzes

```sql
CREATE TYPE question_type_enum AS ENUM ('mcq', 'multiple_select', 'true_false', 'short_answer', 'essay');

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type_enum NOT NULL,
    options JSONB, -- Array of options for MCQ
    correct_answer JSONB, -- Correct answer(s)
    marks DECIMAL(5, 2) NOT NULL,
    order_index INTEGER DEFAULT 0,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
```

### 15. quiz_submissions
Student quiz attempts

```sql
CREATE TABLE quiz_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB, -- { question_id: answer }
    marks_obtained DECIMAL(5, 2),
    total_marks DECIMAL(5, 2),
    percentage DECIMAL(5, 2),
    time_taken INTEGER, -- in seconds
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    is_completed BOOLEAN DEFAULT false,
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
CREATE INDEX idx_quiz_submissions_student_id ON quiz_submissions(student_id);
```

## ERP Module Tables

### 16. attendance
Daily attendance records

```sql
CREATE TYPE attendance_status_enum AS ENUM ('present', 'absent', 'late', 'half_day', 'leave');

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status_enum NOT NULL,
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    marked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### 17. timetable
Class schedules/timetable

```sql
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timetable_class_id ON timetable(class_id);
CREATE INDEX idx_timetable_course_id ON timetable(course_id);
```

### 18. admissions
Admission applications

```sql
CREATE TYPE admission_status_enum AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'enrolled');

CREATE TABLE admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    grade_level INTEGER NOT NULL,
    previous_school VARCHAR(255),
    address TEXT,
    status admission_status_enum DEFAULT 'pending',
    application_date DATE DEFAULT CURRENT_DATE,
    documents JSONB, -- Array of document URLs
    remarks TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admissions_school_id ON admissions(school_id);
CREATE INDEX idx_admissions_status ON admissions(status);
```

### 19. fees
Fee structure and categories

```sql
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    fee_type VARCHAR(100) NOT NULL, -- Tuition, Transport, Library, etc.
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    frequency VARCHAR(50), -- one-time, monthly, quarterly, yearly
    academic_year VARCHAR(20),
    due_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fees_school_id ON fees(school_id);
CREATE INDEX idx_fees_class_id ON fees(class_id);
```

### 20. fee_payments
Fee payment records

```sql
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'partially_paid', 'overdue', 'refunded');

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
    amount_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_date DATE,
    status payment_status_enum DEFAULT 'pending',
    payment_method VARCHAR(50), -- cash, online, cheque, card
    transaction_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    receipt_url TEXT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_fee_id ON fee_payments(fee_id);
CREATE INDEX idx_fee_payments_status ON fee_payments(status);
```

### 21. exams
Exams/Tests

```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Mid-term, Final, Unit Test
    exam_type VARCHAR(50), -- theory, practical
    academic_year VARCHAR(20),
    term VARCHAR(50), -- Term 1, Term 2
    start_date DATE,
    end_date DATE,
    total_marks DECIMAL(5, 2),
    passing_marks DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_school_id ON exams(school_id);
CREATE INDEX idx_exams_class_id ON exams(class_id);
```

### 22. exam_marks
Individual subject marks in exams

```sql
CREATE TABLE exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    total_marks DECIMAL(5, 2),
    grade VARCHAR(5), -- A+, A, B+, etc.
    remarks TEXT,
    entered_by UUID REFERENCES users(id),
    entered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id, course_id)
);

CREATE INDEX idx_exam_marks_exam_id ON exam_marks(exam_id);
CREATE INDEX idx_exam_marks_student_id ON exam_marks(student_id);
```

### 23. report_cards
Generated report cards

```sql
CREATE TABLE report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    academic_year VARCHAR(20),
    term VARCHAR(50),
    total_marks DECIMAL(7, 2),
    marks_obtained DECIMAL(7, 2),
    percentage DECIMAL(5, 2),
    grade VARCHAR(5),
    rank INTEGER,
    attendance_percentage DECIMAL(5, 2),
    teacher_remarks TEXT,
    principal_remarks TEXT,
    pdf_url TEXT,
    generated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_id)
);

CREATE INDEX idx_report_cards_student_id ON report_cards(student_id);
CREATE INDEX idx_report_cards_exam_id ON report_cards(exam_id);
```

## Communication & Notification Tables

### 24. notifications
In-app notifications

```sql
CREATE TYPE notification_type_enum AS ENUM ('homework', 'grade', 'attendance', 'fee', 'announcement', 'system');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### 25. email_logs
Email notification logs

```sql
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    status VARCHAR(50), -- sent, failed, pending
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

### 26. announcements
School-wide announcements

```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_roles JSONB, -- ['student', 'teacher', 'parent']
    target_classes JSONB, -- Array of class IDs
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_announcements_is_published ON announcements(is_published);
```

## System & Audit Tables

### 27. audit_logs
System audit trail

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN
    entity_type VARCHAR(100), -- users, homework, grades
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 28. refresh_tokens
JWT refresh token storage

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

## Indexes Summary

### Composite Indexes (Additional)
```sql
CREATE INDEX idx_enrollments_student_academic ON enrollments(student_id, academic_year);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX idx_homework_course_published ON homework(course_id, is_published);
CREATE INDEX idx_fee_payments_student_status ON fee_payments(student_id, status);
```

## Database Statistics
- **Total Tables**: 28
- **User Management**: 4 tables
- **Academic/LMS**: 12 tables
- **ERP**: 8 tables
- **Communication**: 3 tables
- **System**: 2 tables

## Relationships Summary
- **One-to-Many**: users → user_roles, schools → classes, classes → courses, etc.
- **Many-to-Many**: users ↔ classes (via enrollments), parents ↔ students (via parent_student_relations)
- **One-to-One**: schools → subscriptions

## Storage Estimates (per 1000 students)
- **Users & Roles**: ~100 MB
- **Academic Data**: ~500 MB
- **Homework Submissions**: ~2-5 GB (with files)
- **Attendance Records**: ~50 MB/year
- **Exam & Report Data**: ~200 MB
- **Notifications**: ~100 MB
- **Total**: ~3-6 GB per 1000 students (excluding large media files)
