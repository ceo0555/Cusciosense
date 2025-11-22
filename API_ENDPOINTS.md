# Alfanumrik SchoolOS - API Endpoints

Base URL: `https://api.schoolos.com/v1`

## Authentication

All authenticated endpoints require a JWT token in the header:
```
Authorization: Bearer <token>
```

### Auth Endpoints

#### POST /auth/register
Register a new user (Super Admin only, or during school setup).
```json
Request:
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "SCHOOL_ADMIN"
}

Response: 201
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "SCHOOL_ADMIN"
}
```

#### POST /auth/login
Login with email/phone and password.
```json
Request:
{
  "emailOrPhone": "user@example.com",
  "password": "SecurePass123"
}

Response: 200
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "SCHOOL_ADMIN",
    "profileImageUrl": "url"
  }
}
```

#### POST /auth/send-otp
Send OTP for phone verification or login.
```json
Request:
{
  "phone": "+919876543210",
  "purpose": "LOGIN" // or "VERIFICATION"
}

Response: 200
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

#### POST /auth/verify-otp
Verify OTP and login or complete verification.
```json
Request:
{
  "phone": "+919876543210",
  "otp": "123456"
}

Response: 200
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { ... }
}
```

#### POST /auth/refresh
Refresh access token.
```json
Request:
{
  "refreshToken": "refresh_token"
}

Response: 200
{
  "accessToken": "new_jwt_token"
}
```

#### POST /auth/forgot-password
Request password reset.
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

#### POST /auth/reset-password
Reset password with token.
```json
Request:
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123"
}

Response: 200
{
  "message": "Password reset successful"
}
```

#### POST /auth/logout
Logout and invalidate tokens.
```json
Response: 200
{
  "message": "Logged out successfully"
}
```

---

## User Management

#### GET /users/me
Get current user profile.
```json
Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "+919876543210",
  "firstName": "John",
  "lastName": "Doe",
  "role": "TEACHER",
  "profileImageUrl": "url",
  "schools": [...]
}
```

#### PUT /users/me
Update current user profile.
```json
Request:
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+919876543210"
}

Response: 200
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith"
}
```

#### POST /users/me/upload-photo
Upload profile photo.
```
Request: multipart/form-data
- photo: File

Response: 200
{
  "profileImageUrl": "https://cdn.example.com/photo.jpg"
}
```

#### PUT /users/me/change-password
Change password for current user.
```json
Request:
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}

Response: 200
{
  "message": "Password changed successfully"
}
```

---

## Schools (Super Admin & School Admin)

#### POST /schools
Create a new school (Super Admin only).
```json
Request:
{
  "name": "Springfield High School",
  "code": "SHS001",
  "email": "admin@springfield.edu",
  "phone": "+919876543210",
  "address": "123 Main St",
  "city": "Springfield",
  "state": "State",
  "country": "India",
  "pincode": "123456",
  "subscriptionPlan": "PREMIUM"
}

Response: 201
{
  "id": "uuid",
  "name": "Springfield High School",
  "code": "SHS001",
  ...
}
```

#### GET /schools
List all schools (Super Admin) or user's schools.
```
Query params:
- page: number (default: 1)
- limit: number (default: 20)
- search: string
- status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'

Response: 200
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### GET /schools/:id
Get school details.
```json
Response: 200
{
  "id": "uuid",
  "name": "Springfield High School",
  "code": "SHS001",
  "email": "admin@springfield.edu",
  "subscriptionStatus": "ACTIVE",
  "stats": {
    "totalStudents": 450,
    "totalTeachers": 30,
    "totalClasses": 15
  }
}
```

#### PUT /schools/:id
Update school details (School Admin).
```json
Request:
{
  "name": "Springfield High School",
  "phone": "+919876543210",
  "address": "123 Main St"
}

Response: 200
{
  "id": "uuid",
  ...
}
```

#### DELETE /schools/:id
Delete/deactivate school (Super Admin only).
```json
Response: 200
{
  "message": "School deactivated successfully"
}
```

---

## School Users

#### POST /schools/:schoolId/users
Add user to school (School Admin).
```json
Request:
{
  "email": "teacher@example.com",
  "phone": "+919876543210",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "TEACHER",
  "password": "TempPass123"
}

Response: 201
{
  "id": "uuid",
  "email": "teacher@example.com",
  "role": "TEACHER"
}
```

#### GET /schools/:schoolId/users
List school users.
```
Query params:
- role: 'TEACHER' | 'STUDENT' | 'PARENT'
- page: number
- limit: number
- search: string

Response: 200
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### PUT /schools/:schoolId/users/:userId
Update user role or status in school.
```json
Request:
{
  "role": "SCHOOL_ADMIN",
  "isActive": true
}

Response: 200
{
  "message": "User updated successfully"
}
```

#### DELETE /schools/:schoolId/users/:userId
Remove user from school.
```json
Response: 200
{
  "message": "User removed from school"
}
```

---

## Academic Years

#### POST /schools/:schoolId/academic-years
Create academic year.
```json
Request:
{
  "name": "2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "isCurrent": true
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /schools/:schoolId/academic-years
List academic years.
```json
Response: 200
{
  "data": [...]
}
```

#### PUT /schools/:schoolId/academic-years/:id
Update academic year.

#### DELETE /schools/:schoolId/academic-years/:id
Delete academic year.

---

## Classes

#### POST /schools/:schoolId/classes
Create class.
```json
Request:
{
  "academicYearId": "uuid",
  "name": "Grade 5",
  "section": "A",
  "classTeacherId": "uuid",
  "capacity": 40
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /schools/:schoolId/classes
List classes.
```
Query params:
- academicYearId: uuid
- search: string
- page: number
- limit: number

Response: 200
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

#### GET /classes/:id
Get class details with students and subjects.
```json
Response: 200
{
  "id": "uuid",
  "name": "Grade 5",
  "section": "A",
  "classTeacher": {...},
  "students": [...],
  "subjects": [...],
  "stats": {
    "totalStudents": 35,
    "avgAttendance": 92.5
  }
}
```

#### PUT /classes/:id
Update class details.

#### DELETE /classes/:id
Delete class.

#### POST /classes/:id/students
Enroll student in class.
```json
Request:
{
  "studentId": "uuid",
  "rollNumber": "001"
}

Response: 201
{
  "message": "Student enrolled successfully"
}
```

#### DELETE /classes/:id/students/:studentId
Remove student from class.

---

## Subjects

#### POST /schools/:schoolId/subjects
Create subject.
```json
Request:
{
  "name": "Mathematics",
  "code": "MATH",
  "description": "Mathematics for all grades"
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /schools/:schoolId/subjects
List subjects.

#### PUT /subjects/:id
Update subject.

#### DELETE /subjects/:id
Delete subject.

#### POST /classes/:classId/subjects
Assign subject to class.
```json
Request:
{
  "subjectId": "uuid",
  "teacherId": "uuid"
}

Response: 201
{ "id": "uuid", ... }
```

---

## Courses & Content (LMS)

#### POST /class-subjects/:classSubjectId/courses
Create course.
```json
Request:
{
  "title": "Introduction to Algebra",
  "description": "Basic algebra concepts",
  "syllabus": "...",
  "learningObjectives": "..."
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /class-subjects/:classSubjectId/courses
List courses for a subject.

#### GET /courses/:id
Get course details with content.
```json
Response: 200
{
  "id": "uuid",
  "title": "Introduction to Algebra",
  "description": "...",
  "content": [...]
}
```

#### PUT /courses/:id
Update course.

#### DELETE /courses/:id
Delete course.

#### POST /courses/:courseId/content
Add content to course.
```json
Request:
{
  "title": "Video Lesson 1",
  "description": "...",
  "contentType": "VIDEO",
  "contentUrl": "https://...",
  "duration": 600,
  "orderIndex": 1
}

Response: 201
{ "id": "uuid", ... }
```

#### POST /courses/:courseId/content/upload
Upload content file.
```
Request: multipart/form-data
- file: File
- title: string
- description: string
- contentType: string

Response: 201
{ "id": "uuid", "contentUrl": "...", ... }
```

#### PUT /content/:id
Update content.

#### DELETE /content/:id
Delete content.

---

## Homework

#### POST /class-subjects/:classSubjectId/homework
Create homework.
```json
Request:
{
  "title": "Algebra Practice",
  "description": "Solve problems 1-20",
  "instructions": "Show all work",
  "submissionType": "ALL",
  "maxMarks": 20,
  "dueDate": "2024-12-31T23:59:59Z"
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /class-subjects/:classSubjectId/homework
List homework for subject.
```
Query params:
- status: 'PUBLISHED' | 'DRAFT'
- page: number
- limit: number

Response: 200
{
  "data": [...],
  "total": 50
}
```

#### GET /homework/:id
Get homework details.
```json
Response: 200
{
  "id": "uuid",
  "title": "Algebra Practice",
  "description": "...",
  "dueDate": "2024-12-31T23:59:59Z",
  "attachments": [...],
  "submissions": [...],
  "stats": {
    "totalSubmissions": 30,
    "pendingSubmissions": 5,
    "avgMarks": 15.5
  }
}
```

#### PUT /homework/:id
Update homework.

#### DELETE /homework/:id
Delete homework.

#### POST /homework/:id/attachments/upload
Upload homework attachment.
```
Request: multipart/form-data
- file: File

Response: 201
{ "id": "uuid", "fileUrl": "...", ... }
```

#### POST /homework/:homeworkId/submit
Submit homework (Student).
```json
Request:
{
  "submissionText": "My answers...",
  "drawingData": "{...}", // JSON canvas data
  "status": "SUBMITTED"
}

Response: 201
{ "id": "uuid", ... }
```

#### POST /homework/:homeworkId/submissions/:submissionId/attachments/upload
Upload submission attachment.
```
Request: multipart/form-data
- file: File (PDF or Image)

Response: 201
{ "id": "uuid", "fileUrl": "...", ... }
```

#### GET /homework/:homeworkId/submissions
List submissions (Teacher).
```json
Response: 200
{
  "data": [
    {
      "id": "uuid",
      "student": {...},
      "submittedAt": "...",
      "status": "SUBMITTED",
      "marksObtained": null
    }
  ]
}
```

#### GET /homework/:homeworkId/my-submission
Get my submission (Student).
```json
Response: 200
{
  "id": "uuid",
  "submissionText": "...",
  "drawingData": "{...}",
  "attachments": [...],
  "status": "SUBMITTED",
  "marksObtained": 18,
  "feedback": "Good work!"
}
```

#### PUT /homework/:homeworkId/submissions/:submissionId/grade
Grade submission (Teacher).
```json
Request:
{
  "marksObtained": 18,
  "feedback": "Good work! Minor errors in Q5."
}

Response: 200
{ "message": "Submission graded successfully" }
```

---

## Quizzes

#### POST /class-subjects/:classSubjectId/quizzes
Create quiz.
```json
Request:
{
  "title": "Algebra Quiz 1",
  "description": "...",
  "duration": 30,
  "maxMarks": 20,
  "passMarks": 10,
  "startTime": "2024-12-01T10:00:00Z",
  "endTime": "2024-12-01T11:00:00Z",
  "shuffleQuestions": true,
  "showResults": true
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /quizzes/:id
Get quiz details.

#### POST /quizzes/:id/questions
Add question to quiz.
```json
Request:
{
  "questionText": "What is 2 + 2?",
  "questionType": "MCQ",
  "options": ["2", "3", "4", "5"],
  "correctAnswer": "4",
  "marks": 1,
  "orderIndex": 1
}

Response: 201
{ "id": "uuid", ... }
```

#### PUT /quizzes/:id/questions/:questionId
Update question.

#### DELETE /quizzes/:id/questions/:questionId
Delete question.

#### POST /quizzes/:id/start
Start quiz attempt (Student).
```json
Response: 201
{
  "attemptId": "uuid",
  "startedAt": "...",
  "expiresAt": "...",
  "questions": [...]
}
```

#### POST /quizzes/:id/attempts/:attemptId/answers
Submit answer (Student).
```json
Request:
{
  "questionId": "uuid",
  "studentAnswer": "4"
}

Response: 200
{
  "message": "Answer recorded"
}
```

#### POST /quizzes/:id/attempts/:attemptId/submit
Submit complete quiz.
```json
Response: 200
{
  "marksObtained": 18,
  "totalMarks": 20,
  "percentage": 90,
  "passed": true
}
```

#### GET /quizzes/:id/attempts/:attemptId/results
Get quiz results (Student).

---

## Attendance

#### POST /classes/:classId/attendance
Mark attendance for class.
```json
Request:
{
  "date": "2024-12-01",
  "attendance": [
    {
      "studentId": "uuid",
      "status": "PRESENT"
    },
    {
      "studentId": "uuid2",
      "status": "ABSENT",
      "remarks": "Sick leave"
    }
  ]
}

Response: 201
{
  "message": "Attendance marked successfully"
}
```

#### GET /classes/:classId/attendance
Get attendance records.
```
Query params:
- startDate: date
- endDate: date
- studentId: uuid (optional)

Response: 200
{
  "data": [...]
}
```

#### GET /students/:studentId/attendance
Get student attendance.
```
Query params:
- startDate: date
- endDate: date

Response: 200
{
  "data": [...],
  "stats": {
    "totalDays": 100,
    "present": 92,
    "absent": 5,
    "late": 3,
    "percentage": 92.0
  }
}
```

#### PUT /attendance/:id
Update attendance record.

---

## Timetable

#### POST /classes/:classId/timetable
Create timetable entry.
```json
Request:
{
  "subjectId": "uuid",
  "teacherId": "uuid",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00",
  "roomNumber": "Room 101"
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /classes/:classId/timetable
Get class timetable.
```json
Response: 200
{
  "data": [
    {
      "dayOfWeek": 1,
      "slots": [...]
    }
  ]
}
```

#### GET /teachers/:teacherId/timetable
Get teacher's timetable.

#### PUT /timetable/:id
Update timetable entry.

#### DELETE /timetable/:id
Delete timetable entry.

---

## Exams

#### POST /schools/:schoolId/exams
Create exam.
```json
Request:
{
  "academicYearId": "uuid",
  "name": "Mid Term Exam",
  "examType": "TERM",
  "startDate": "2024-12-01",
  "endDate": "2024-12-15"
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /schools/:schoolId/exams
List exams.

#### GET /exams/:id
Get exam details.

#### PUT /exams/:id
Update exam.

#### DELETE /exams/:id
Delete exam.

#### POST /exams/:examId/subjects
Add subject to exam.
```json
Request:
{
  "classSubjectId": "uuid",
  "examDate": "2024-12-05",
  "maxMarks": 100,
  "passMarks": 40
}

Response: 201
{ "id": "uuid", ... }
```

#### POST /exam-subjects/:examSubjectId/results
Enter exam results (Teacher).
```json
Request:
{
  "results": [
    {
      "studentId": "uuid",
      "marksObtained": 85,
      "grade": "A",
      "remarks": "Excellent"
    }
  ]
}

Response: 201
{
  "message": "Results entered successfully"
}
```

#### GET /exams/:examId/results
Get exam results.
```
Query params:
- classId: uuid (optional)
- studentId: uuid (optional)

Response: 200
{
  "data": [...]
}
```

---

## Report Cards

#### POST /exams/:examId/report-cards/generate
Generate report cards for exam.
```json
Response: 200
{
  "message": "Report cards generated successfully",
  "total": 450
}
```

#### GET /exams/:examId/report-cards/:studentId
Get student's report card.
```json
Response: 200
{
  "id": "uuid",
  "student": {...},
  "exam": {...},
  "results": [...],
  "totalMarks": 450,
  "percentage": 85.5,
  "overallGrade": "A",
  "rank": 12,
  "attendancePercentage": 95.0,
  "pdfUrl": "https://..."
}
```

#### GET /exams/:examId/report-cards/:studentId/download
Download report card PDF.

---

## Fees

#### POST /schools/:schoolId/fee-structures
Create fee structure.
```json
Request:
{
  "academicYearId": "uuid",
  "classId": "uuid",
  "feeType": "TUITION",
  "amount": 5000,
  "frequency": "MONTHLY",
  "dueDay": 5,
  "isMandatory": true
}

Response: 201
{ "id": "uuid", ... }
```

#### GET /schools/:schoolId/fee-structures
List fee structures.

#### PUT /fee-structures/:id
Update fee structure.

#### DELETE /fee-structures/:id
Delete fee structure.

#### GET /students/:studentId/fees
Get student's fee details.
```json
Response: 200
{
  "dueAmount": 15000,
  "paidAmount": 10000,
  "pendingAmount": 5000,
  "payments": [...]
}
```

#### POST /students/:studentId/fees/pay
Initiate fee payment.
```json
Request:
{
  "feeStructureId": "uuid",
  "amount": 5000,
  "paymentMethod": "ONLINE"
}

Response: 200
{
  "orderId": "order_xxx",
  "razorpayOrderId": "razorpay_order_xxx",
  "amount": 5000,
  "currency": "INR",
  "key": "razorpay_key"
}
```

#### POST /students/:studentId/fees/verify-payment
Verify payment after Razorpay callback.
```json
Request:
{
  "razorpayPaymentId": "pay_xxx",
  "razorpayOrderId": "order_xxx",
  "razorpaySignature": "signature_xxx"
}

Response: 200
{
  "message": "Payment verified successfully",
  "receipt": {...}
}
```

#### GET /fee-payments/:id/receipt
Download payment receipt.

---

## Subscriptions (Platform)

#### POST /subscriptions/plans
Get subscription plans (public).
```json
Response: 200
{
  "plans": [
    {
      "name": "BASIC",
      "price": 999,
      "features": [...],
      "limits": {
        "maxStudents": 100,
        "maxTeachers": 10
      }
    }
  ]
}
```

#### POST /schools/:schoolId/subscriptions/subscribe
Subscribe school to plan.
```json
Request:
{
  "planName": "PREMIUM",
  "billingCycle": "ANNUALLY"
}

Response: 200
{
  "subscriptionId": "uuid",
  "razorpaySubscriptionId": "sub_xxx",
  "amount": 9999,
  "shortUrl": "https://razorpay.com/..."
}
```

#### GET /schools/:schoolId/subscriptions
Get school subscriptions.

---

## Notifications

#### GET /notifications
Get user notifications.
```
Query params:
- type: notification type (optional)
- isRead: boolean (optional)
- page: number
- limit: number

Response: 200
{
  "data": [...],
  "total": 50,
  "unreadCount": 12
}
```

#### PUT /notifications/:id/read
Mark notification as read.

#### PUT /notifications/read-all
Mark all notifications as read.

#### DELETE /notifications/:id
Delete notification.

---

## Parents

#### POST /parents/:parentId/children
Link child to parent.
```json
Request:
{
  "studentId": "uuid",
  "relationship": "FATHER",
  "isPrimary": true
}

Response: 201
{
  "message": "Child linked successfully"
}
```

#### GET /parents/:parentId/children
Get parent's children.

#### GET /parents/:parentId/children/:studentId/overview
Get child's overview (attendance, grades, homework).
```json
Response: 200
{
  "student": {...},
  "attendance": {...},
  "recentHomework": [...],
  "recentGrades": [...],
  "upcomingEvents": [...]
}
```

---

## Analytics & Reports

#### GET /schools/:schoolId/analytics/dashboard
Get school dashboard analytics.
```json
Response: 200
{
  "totalStudents": 450,
  "totalTeachers": 30,
  "avgAttendance": 92.5,
  "feeCollection": {
    "total": 5000000,
    "collected": 4500000,
    "pending": 500000
  },
  "recentActivities": [...]
}
```

#### GET /schools/:schoolId/reports/attendance
Generate attendance report.
```
Query params:
- startDate: date
- endDate: date
- classId: uuid (optional)
- format: 'JSON' | 'PDF' | 'EXCEL'

Response: 200 (JSON) or file download
```

#### GET /schools/:schoolId/reports/academic
Generate academic performance report.

#### GET /schools/:schoolId/reports/financial
Generate financial report.

---

## File Upload

#### POST /upload/image
Upload image (profile photos, homework, etc.).
```
Request: multipart/form-data
- file: File
- folder: string (optional)

Response: 200
{
  "url": "https://cdn.example.com/image.jpg",
  "fileName": "image.jpg",
  "fileSize": 102400
}
```

#### POST /upload/document
Upload document (PDFs, etc.).
```
Request: multipart/form-data
- file: File
- folder: string (optional)

Response: 200
{
  "url": "https://cdn.example.com/doc.pdf",
  "fileName": "doc.pdf",
  "fileSize": 512000
}
```

---

## Error Responses

All endpoints may return these error responses:

```json
400 Bad Request
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}

403 Forbidden
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}

404 Not Found
{
  "statusCode": 404,
  "message": "Resource not found"
}

500 Internal Server Error
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- Anonymous requests: 100 requests/hour
- Authenticated requests: 1000 requests/hour
- File uploads: 50 requests/hour

## Pagination

Default pagination format:
```
?page=1&limit=20

Response includes:
{
  "data": [...],
  "total": 1000,
  "page": 1,
  "limit": 20,
  "totalPages": 50
}
```

## Search & Filtering

Most list endpoints support:
- `search`: Full-text search
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'
- Filter by specific fields (varies by endpoint)
