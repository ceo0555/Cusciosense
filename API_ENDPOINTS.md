# Alfanumrik SchoolOS - API Endpoints

Base URL: `https://api.schoolos.com/v1` (Production)
Local: `http://localhost:5000/api/v1` (Development)

## Authentication

All endpoints (except auth and public routes) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication & Authorization

### POST `/auth/register`
Register a new user (email/phone based)
```json
Request:
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}

Response: 201
{
  "user": { "id": "uuid", "email": "...", "role": "STUDENT" },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST `/auth/login`
Login with email/phone
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200
{
  "user": { "id": "uuid", "email": "...", "role": "STUDENT" },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST `/auth/refresh`
Refresh access token
```json
Request:
{
  "refreshToken": "refresh-token"
}

Response: 200
{
  "accessToken": "new-jwt-token"
}
```

### POST `/auth/logout`
Logout user
```json
Response: 200
{
  "message": "Logged out successfully"
}
```

### POST `/auth/forgot-password`
Request password reset
```json
Request:
{
  "email": "user@example.com"
}

Response: 200
{
  "message": "Password reset link sent to email"
}
```

### POST `/auth/reset-password`
Reset password with token
```json
Request:
{
  "token": "reset-token",
  "newPassword": "NewSecurePass123!"
}

Response: 200
{
  "message": "Password reset successfully"
}
```

### POST `/auth/verify-email`
Verify email address
```json
Request:
{
  "token": "verification-token"
}

Response: 200
{
  "message": "Email verified successfully"
}
```

---

## 2. User Management

### GET `/users/me`
Get current user profile
```json
Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "avatarUrl": "https://...",
  "isActive": true
}
```

### PATCH `/users/me`
Update current user profile
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST `/users/me/avatar`
Upload user avatar
```
Request: multipart/form-data
file: <image-file>

Response: 200
{
  "avatarUrl": "https://cdn.schoolos.com/avatars/uuid.jpg"
}
```

### PATCH `/users/me/password`
Change password
```json
Request:
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}

Response: 200
{
  "message": "Password changed successfully"
}
```

### GET `/users` [ADMIN]
List all users (with filters)
```
Query params: ?role=STUDENT&schoolId=uuid&page=1&limit=20

Response: 200
{
  "data": [...users],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

## 3. School Management

### POST `/schools` [SUPER_ADMIN]
Create a new school
```json
Request:
{
  "name": "ABC School",
  "code": "ABC001",
  "email": "admin@abcschool.com",
  "phone": "+919876543210",
  "address": "123 School Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "board": "CBSE"
}

Response: 201
{
  "id": "uuid",
  "name": "ABC School",
  "code": "ABC001",
  ...
}
```

### GET `/schools`
List all schools [SUPER_ADMIN] or user's schools
```
Query params: ?page=1&limit=20&search=ABC

Response: 200
{
  "data": [...schools],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### GET `/schools/:id`
Get school details
```json
Response: 200
{
  "id": "uuid",
  "name": "ABC School",
  "code": "ABC001",
  "email": "admin@abcschool.com",
  "stats": {
    "totalStudents": 500,
    "totalTeachers": 30,
    "totalClasses": 12
  }
}
```

### PATCH `/schools/:id` [SCHOOL_ADMIN]
Update school details
```json
Request:
{
  "name": "ABC International School",
  "phone": "+919876543211"
}

Response: 200
{
  "id": "uuid",
  "name": "ABC International School",
  ...
}
```

### POST `/schools/:id/logo` [SCHOOL_ADMIN]
Upload school logo
```
Request: multipart/form-data
file: <image-file>

Response: 200
{
  "logoUrl": "https://cdn.schoolos.com/logos/uuid.jpg"
}
```

---

## 4. Academic Year & Classes

### POST `/academic-years` [SCHOOL_ADMIN]
Create academic year
```json
Request:
{
  "schoolId": "uuid",
  "name": "2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "isCurrent": true
}

Response: 201
{
  "id": "uuid",
  "name": "2024-2025",
  ...
}
```

### GET `/academic-years`
List academic years
```json
Response: 200
{
  "data": [...academic years]
}
```

### POST `/classes` [SCHOOL_ADMIN]
Create a class
```json
Request:
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "name": "Class 10",
  "grade": 10
}

Response: 201
{
  "id": "uuid",
  "name": "Class 10",
  "grade": 10
}
```

### GET `/classes`
List classes
```
Query params: ?schoolId=uuid&academicYearId=uuid

Response: 200
{
  "data": [...classes]
}
```

### POST `/sections` [SCHOOL_ADMIN]
Create a section
```json
Request:
{
  "classId": "uuid",
  "name": "A",
  "teacherId": "uuid",
  "capacity": 40
}

Response: 201
{
  "id": "uuid",
  "name": "A",
  ...
}
```

### GET `/sections/:id/students`
Get students in a section
```json
Response: 200
{
  "data": [...students],
  "total": 35
}
```

---

## 5. Staff Management

### POST `/staff` [SCHOOL_ADMIN]
Add staff member
```json
Request:
{
  "userId": "uuid",
  "schoolId": "uuid",
  "staffType": "TEACHER",
  "employeeId": "EMP001",
  "designation": "Senior Teacher",
  "joiningDate": "2024-01-01",
  "subjects": ["Mathematics", "Physics"]
}

Response: 201
{
  "id": "uuid",
  "employeeId": "EMP001",
  ...
}
```

### GET `/staff`
List staff members
```
Query params: ?schoolId=uuid&staffType=TEACHER&page=1&limit=20

Response: 200
{
  "data": [...staff],
  "total": 30
}
```

### PATCH `/staff/:id` [SCHOOL_ADMIN]
Update staff details
```json
Request:
{
  "designation": "Head of Department",
  "salary": 50000
}

Response: 200
{
  "id": "uuid",
  ...
}
```

---

## 6. Student Management

### POST `/students` [SCHOOL_ADMIN]
Add student
```json
Request:
{
  "userId": "uuid",
  "schoolId": "uuid",
  "sectionId": "uuid",
  "admissionNumber": "ADM2024001",
  "rollNumber": "1",
  "dateOfBirth": "2010-05-15",
  "gender": "MALE",
  "parentId": "uuid",
  "address": "123 Street"
}

Response: 201
{
  "id": "uuid",
  "admissionNumber": "ADM2024001",
  ...
}
```

### GET `/students`
List students
```
Query params: ?schoolId=uuid&sectionId=uuid&status=ACTIVE&page=1&limit=20

Response: 200
{
  "data": [...students],
  "total": 500
}
```

### GET `/students/:id`
Get student details
```json
Response: 200
{
  "id": "uuid",
  "admissionNumber": "ADM2024001",
  "user": { "firstName": "...", "lastName": "..." },
  "section": { "name": "A", "class": { "name": "Class 10" } },
  "parent": { "name": "...", "email": "..." }
}
```

### GET `/students/:id/performance`
Get student performance overview
```json
Response: 200
{
  "attendance": {
    "percentage": 92.5,
    "present": 185,
    "absent": 15
  },
  "academics": {
    "averagePercentage": 85.3,
    "rank": 5,
    "totalExams": 4
  },
  "homework": {
    "submitted": 45,
    "pending": 2,
    "average_marks": 87.5
  }
}
```

---

## 7. Admissions

### POST `/admissions` [PUBLIC or SCHOOL_ADMIN]
Create admission application
```json
Request:
{
  "schoolId": "uuid",
  "studentName": "John Doe",
  "parentName": "Jane Doe",
  "parentEmail": "parent@example.com",
  "parentPhone": "+919876543210",
  "classApplyingFor": "Class 5",
  "dateOfBirth": "2015-08-20",
  "previousSchool": "XYZ School"
}

Response: 201
{
  "id": "uuid",
  "applicationNumber": "APP2024001",
  "status": "PENDING"
}
```

### GET `/admissions` [SCHOOL_ADMIN]
List admission applications
```
Query params: ?schoolId=uuid&status=PENDING&page=1&limit=20

Response: 200
{
  "data": [...admissions],
  "total": 25
}
```

### PATCH `/admissions/:id/status` [SCHOOL_ADMIN]
Update admission status
```json
Request:
{
  "status": "APPROVED",
  "remarks": "Approved for admission"
}

Response: 200
{
  "id": "uuid",
  "status": "APPROVED"
}
```

---

## 8. Attendance

### POST `/attendance` [TEACHER]
Mark attendance for a section
```json
Request:
{
  "sectionId": "uuid",
  "date": "2024-11-22",
  "attendance": [
    { "studentId": "uuid1", "status": "PRESENT" },
    { "studentId": "uuid2", "status": "ABSENT", "remarks": "Sick" },
    { "studentId": "uuid3", "status": "LATE" }
  ]
}

Response: 201
{
  "message": "Attendance marked successfully",
  "count": 35
}
```

### GET `/attendance`
Get attendance records
```
Query params: ?sectionId=uuid&date=2024-11-22&studentId=uuid&startDate=2024-11-01&endDate=2024-11-30

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "student": { "name": "John Doe", "rollNumber": "1" },
      "date": "2024-11-22",
      "status": "PRESENT"
    }
  ]
}
```

### GET `/attendance/summary`
Get attendance summary
```
Query params: ?studentId=uuid&sectionId=uuid&month=11&year=2024

Response: 200
{
  "total": 20,
  "present": 18,
  "absent": 2,
  "late": 0,
  "percentage": 90.0
}
```

---

## 9. Subjects & Timetable

### POST `/subjects` [SCHOOL_ADMIN]
Create subject
```json
Request:
{
  "schoolId": "uuid",
  "classId": "uuid",
  "name": "Mathematics",
  "code": "MATH10",
  "teacherId": "uuid",
  "creditHours": 4
}

Response: 201
{
  "id": "uuid",
  "name": "Mathematics",
  "code": "MATH10"
}
```

### GET `/subjects`
List subjects
```
Query params: ?schoolId=uuid&classId=uuid

Response: 200
{
  "data": [...subjects]
}
```

### POST `/timetables` [SCHOOL_ADMIN]
Create timetable entry
```json
Request:
{
  "sectionId": "uuid",
  "subjectId": "uuid",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "10:00",
  "roomNumber": "101"
}

Response: 201
{
  "id": "uuid",
  ...
}
```

### GET `/timetables`
Get timetable
```
Query params: ?sectionId=uuid&dayOfWeek=MONDAY

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "subject": { "name": "Mathematics" },
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "10:00",
      "roomNumber": "101"
    }
  ]
}
```

---

## 10. LMS - Courses & Content

### POST `/courses` [TEACHER]
Create course
```json
Request:
{
  "subjectId": "uuid",
  "title": "Introduction to Algebra",
  "description": "Basic algebra concepts",
  "sequenceOrder": 1
}

Response: 201
{
  "id": "uuid",
  "title": "Introduction to Algebra"
}
```

### GET `/courses`
List courses
```
Query params: ?subjectId=uuid&isPublished=true

Response: 200
{
  "data": [...courses]
}
```

### POST `/courses/:id/content` [TEACHER]
Add course content
```json
Request:
{
  "title": "Linear Equations Video",
  "contentType": "VIDEO",
  "contentUrl": "https://youtube.com/...",
  "durationMinutes": 30,
  "sequenceOrder": 1
}

Response: 201
{
  "id": "uuid",
  "title": "Linear Equations Video"
}
```

### GET `/courses/:id/content`
Get course content
```json
Response: 200
{
  "data": [
    {
      "id": "uuid",
      "title": "Linear Equations Video",
      "contentType": "VIDEO",
      "contentUrl": "https://...",
      "durationMinutes": 30
    }
  ]
}
```

---

## 11. Homework

### POST `/homework` [TEACHER]
Create homework
```json
Request:
{
  "subjectId": "uuid",
  "sectionId": "uuid",
  "title": "Chapter 5 Exercises",
  "description": "Complete exercises 1-10 from Chapter 5",
  "dueDate": "2024-11-30T23:59:59Z",
  "maxMarks": 20
}

Response: 201
{
  "id": "uuid",
  "title": "Chapter 5 Exercises"
}
```

### POST `/homework/:id/attachment` [TEACHER]
Upload homework attachment
```
Request: multipart/form-data
file: <pdf-file>

Response: 200
{
  "attachmentUrl": "https://cdn.schoolos.com/homework/uuid.pdf"
}
```

### GET `/homework`
List homework
```
Query params: ?sectionId=uuid&subjectId=uuid&studentId=uuid&status=PENDING

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "title": "Chapter 5 Exercises",
      "subject": { "name": "Mathematics" },
      "dueDate": "2024-11-30T23:59:59Z",
      "maxMarks": 20,
      "submission": { "status": "SUBMITTED", "marksObtained": 18 }
    }
  ]
}
```

### POST `/homework/:id/submit` [STUDENT]
Submit homework
```json
Request (multipart/form-data):
{
  "submissionType": "MIXED",
  "textContent": "My answers...",
  "drawingData": { ... canvas data ... },
  files: [<image1>, <pdf1>]
}

Response: 201
{
  "id": "uuid",
  "homeworkId": "uuid",
  "status": "SUBMITTED",
  "submittedAt": "2024-11-25T10:30:00Z"
}
```

### GET `/homework/:id/submissions` [TEACHER]
Get homework submissions
```json
Response: 200
{
  "data": [
    {
      "id": "uuid",
      "student": { "name": "John Doe", "rollNumber": "1" },
      "submittedAt": "2024-11-25T10:30:00Z",
      "status": "SUBMITTED",
      "marksObtained": null
    }
  ]
}
```

### PATCH `/homework/submissions/:id/grade` [TEACHER]
Grade homework submission
```json
Request:
{
  "marksObtained": 18,
  "feedback": "Good work! Minor mistakes in Q5."
}

Response: 200
{
  "id": "uuid",
  "marksObtained": 18,
  "feedback": "Good work!",
  "status": "GRADED"
}
```

---

## 12. Quizzes

### POST `/quizzes` [TEACHER]
Create quiz
```json
Request:
{
  "subjectId": "uuid",
  "sectionId": "uuid",
  "title": "Chapter 5 Quiz",
  "description": "MCQ quiz on Chapter 5",
  "durationMinutes": 30,
  "totalMarks": 20,
  "passingMarks": 10,
  "questions": [
    {
      "question": "What is 2+2?",
      "type": "MCQ",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "marks": 1
    }
  ],
  "startTime": "2024-11-25T10:00:00Z",
  "endTime": "2024-11-25T11:00:00Z"
}

Response: 201
{
  "id": "uuid",
  "title": "Chapter 5 Quiz"
}
```

### GET `/quizzes`
List quizzes
```
Query params: ?sectionId=uuid&subjectId=uuid&isPublished=true

Response: 200
{
  "data": [...quizzes]
}
```

### POST `/quizzes/:id/start` [STUDENT]
Start quiz attempt
```json
Response: 201
{
  "attemptId": "uuid",
  "quizId": "uuid",
  "startedAt": "2024-11-25T10:15:00Z",
  "questions": [...] // without correct answers
}
```

### POST `/quizzes/:id/submit` [STUDENT]
Submit quiz
```json
Request:
{
  "attemptId": "uuid",
  "answers": [
    { "questionId": 0, "answer": 1 },
    { "questionId": 1, "answer": 2 }
  ]
}

Response: 200
{
  "attemptId": "uuid",
  "marksObtained": 18,
  "totalMarks": 20,
  "percentage": 90,
  "status": "EVALUATED"
}
```

---

## 13. Exams & Results

### POST `/exams` [SCHOOL_ADMIN]
Create exam
```json
Request:
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "name": "Mid-term Exam",
  "examType": "MIDTERM",
  "startDate": "2024-12-01",
  "endDate": "2024-12-15"
}

Response: 201
{
  "id": "uuid",
  "name": "Mid-term Exam"
}
```

### POST `/exams/:id/schedules` [SCHOOL_ADMIN]
Create exam schedule
```json
Request:
{
  "subjectId": "uuid",
  "sectionId": "uuid",
  "examDate": "2024-12-01",
  "startTime": "09:00",
  "endTime": "12:00",
  "maxMarks": 100,
  "roomNumber": "Hall A"
}

Response: 201
{
  "id": "uuid",
  ...
}
```

### GET `/exams/:id/schedules`
Get exam schedules
```
Query params: ?sectionId=uuid

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "subject": { "name": "Mathematics" },
      "examDate": "2024-12-01",
      "startTime": "09:00",
      "endTime": "12:00",
      "maxMarks": 100
    }
  ]
}
```

### POST `/exam-results` [TEACHER]
Enter exam results
```json
Request:
{
  "examScheduleId": "uuid",
  "results": [
    { "studentId": "uuid1", "marksObtained": 85, "grade": "A" },
    { "studentId": "uuid2", "marksObtained": 72, "grade": "B" }
  ]
}

Response: 201
{
  "message": "Results entered successfully",
  "count": 35
}
```

### GET `/exam-results`
Get exam results
```
Query params: ?examId=uuid&studentId=uuid&sectionId=uuid

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "student": { "name": "John Doe" },
      "subject": { "name": "Mathematics" },
      "marksObtained": 85,
      "maxMarks": 100,
      "grade": "A"
    }
  ]
}
```

---

## 14. Report Cards

### POST `/report-cards/generate` [TEACHER, SCHOOL_ADMIN]
Generate report card
```json
Request:
{
  "studentId": "uuid",
  "examId": "uuid"
}

Response: 201
{
  "id": "uuid",
  "pdfUrl": "https://cdn.schoolos.com/reports/uuid.pdf",
  "totalMarksObtained": 425,
  "totalMaxMarks": 500,
  "percentage": 85.0,
  "grade": "A",
  "rank": 5
}
```

### GET `/report-cards`
List report cards
```
Query params: ?studentId=uuid&examId=uuid

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "exam": { "name": "Mid-term" },
      "percentage": 85.0,
      "grade": "A",
      "rank": 5,
      "pdfUrl": "https://..."
    }
  ]
}
```

### GET `/report-cards/:id/download`
Download report card PDF
```
Response: 200
Content-Type: application/pdf
<PDF binary data>
```

---

## 15. Fee Management

### POST `/fee-structures` [SCHOOL_ADMIN]
Create fee structure
```json
Request:
{
  "schoolId": "uuid",
  "classId": "uuid",
  "academicYearId": "uuid",
  "feeType": "TUITION",
  "amount": 25000,
  "dueDate": "2024-05-01",
  "description": "Tuition fee for Term 1"
}

Response: 201
{
  "id": "uuid",
  "feeType": "TUITION",
  "amount": 25000
}
```

### GET `/fee-structures`
List fee structures
```
Query params: ?schoolId=uuid&classId=uuid&academicYearId=uuid

Response: 200
{
  "data": [...fee structures]
}
```

### POST `/fee-payments` [SCHOOL_ADMIN, PARENT]
Record fee payment
```json
Request:
{
  "studentId": "uuid",
  "feeStructureId": "uuid",
  "amount": 25000,
  "paymentMethod": "ONLINE",
  "transactionId": "TXN123456"
}

Response: 201
{
  "id": "uuid",
  "receiptNumber": "REC2024001",
  "amount": 25000,
  "paymentStatus": "PAID"
}
```

### GET `/fee-payments`
List fee payments
```
Query params: ?studentId=uuid&schoolId=uuid&status=PAID&page=1&limit=20

Response: 200
{
  "data": [...payments]
}
```

### GET `/fee-payments/:id/receipt`
Download fee receipt PDF
```
Response: 200
Content-Type: application/pdf
<PDF binary data>
```

---

## 16. Subscription & Payments (Razorpay)

### POST `/subscriptions` [SCHOOL_ADMIN]
Create school subscription
```json
Request:
{
  "schoolId": "uuid",
  "plan": "PREMIUM",
  "billingCycle": "YEARLY"
}

Response: 201
{
  "id": "uuid",
  "plan": "PREMIUM",
  "amount": 50000,
  "razorpayOrderId": "order_xxx"
}
```

### POST `/subscriptions/:id/verify-payment` [SCHOOL_ADMIN]
Verify Razorpay payment
```json
Request:
{
  "razorpayPaymentId": "pay_xxx",
  "razorpayOrderId": "order_xxx",
  "razorpaySignature": "signature_xxx"
}

Response: 200
{
  "status": "SUCCESS",
  "subscription": {
    "status": "ACTIVE",
    "startDate": "2024-11-22",
    "endDate": "2025-11-22"
  }
}
```

### GET `/subscriptions`
Get subscription details
```
Query params: ?schoolId=uuid

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "plan": "PREMIUM",
      "status": "ACTIVE",
      "startDate": "2024-11-22",
      "endDate": "2025-11-22"
    }
  ]
}
```

---

## 17. Notifications

### GET `/notifications`
Get user notifications
```
Query params: ?isRead=false&category=HOMEWORK&page=1&limit=20

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "title": "New Homework Assigned",
      "message": "Mathematics homework due on 30th Nov",
      "type": "INFO",
      "category": "HOMEWORK",
      "isRead": false,
      "link": "/homework/uuid",
      "createdAt": "2024-11-22T10:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### PATCH `/notifications/:id/read`
Mark notification as read
```json
Response: 200
{
  "id": "uuid",
  "isRead": true
}
```

### PATCH `/notifications/read-all`
Mark all as read
```json
Response: 200
{
  "message": "All notifications marked as read"
}
```

### POST `/notifications/send` [ADMIN]
Send bulk notification
```json
Request:
{
  "title": "School Holiday Notice",
  "message": "School will remain closed on 25th Nov",
  "type": "ANNOUNCEMENT",
  "category": "GENERAL",
  "recipients": {
    "schoolId": "uuid",
    "roles": ["TEACHER", "STUDENT", "PARENT"]
  }
}

Response: 201
{
  "message": "Notification sent successfully",
  "count": 500
}
```

---

## 18. Analytics & Reports [ADMIN]

### GET `/analytics/dashboard`
Get dashboard analytics
```
Query params: ?schoolId=uuid&academicYearId=uuid

Response: 200
{
  "students": {
    "total": 500,
    "active": 485,
    "new": 50
  },
  "teachers": {
    "total": 30,
    "active": 28
  },
  "attendance": {
    "today": 92.5,
    "thisMonth": 89.3
  },
  "fees": {
    "collected": 5000000,
    "pending": 500000,
    "collectionRate": 90.9
  },
  "exams": {
    "upcoming": 2,
    "ongoing": 1,
    "completed": 3
  }
}
```

### GET `/analytics/attendance-report`
Get attendance report
```
Query params: ?schoolId=uuid&sectionId=uuid&startDate=2024-11-01&endDate=2024-11-30

Response: 200
{
  "data": [
    {
      "date": "2024-11-01",
      "present": 32,
      "absent": 3,
      "percentage": 91.4
    }
  ]
}
```

### GET `/analytics/performance-report`
Get academic performance report
```
Query params: ?schoolId=uuid&classId=uuid&examId=uuid

Response: 200
{
  "classAverage": 75.5,
  "toppers": [...],
  "subjectWiseAverage": {
    "Mathematics": 78.5,
    "English": 72.3
  }
}
```

---

## Rate Limiting

- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Admin: 5000 requests/hour

## Error Responses

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "timestamp": "2024-11-22T10:00:00Z",
  "path": "/api/v1/endpoint"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 429: Too Many Requests
- 500: Internal Server Error
