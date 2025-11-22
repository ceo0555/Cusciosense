# API Endpoints - Alfanumrik SchoolOS

Base URL: `https://api.schoolos.com/v1`

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "phone": "+911234567890",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "parent",
  "schoolId": "uuid" // Optional for super admin
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "parent"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### POST /auth/login
Login with email/phone and password.

**Body:**
```json
{
  "email": "user@example.com", // or "phone": "+911234567890"
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "parent",
    "school": { "id": "uuid", "name": "ABC School" }
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### POST /auth/refresh
Refresh access token.

**Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### POST /auth/logout
Logout and invalidate refresh token.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

### POST /auth/forgot-password
Request password reset.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

### POST /auth/reset-password
Reset password with token.

**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newSecurePassword123"
}
```

**Response:** `200 OK`

### POST /auth/verify-email
Verify email address.

**Body:**
```json
{
  "token": "verification_token"
}
```

**Response:** `200 OK`

---

## User Endpoints

### GET /users/me
Get current user profile.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "teacher",
  "school": { "id": "uuid", "name": "ABC School" },
  "avatarUrl": "https://...",
  "isVerified": true
}
```

### PUT /users/me
Update current user profile.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+911234567890",
  "avatarUrl": "https://..."
}
```

**Response:** `200 OK`

### PUT /users/me/password
Change password.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

**Response:** `200 OK`

### GET /users
List users (Admin only).

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `page` (default: 1)
- `limit` (default: 20)
- `role` (filter by role)
- `schoolId` (filter by school)
- `search` (search by name/email)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "teacher",
      "school": { "id": "uuid", "name": "ABC School" },
      "isActive": true
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### GET /users/:id
Get user by ID.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

### PUT /users/:id
Update user (Admin only).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "roleId": 3
}
```

**Response:** `200 OK`

### DELETE /users/:id
Delete user (Admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## School Endpoints

### POST /schools
Create a new school (Super Admin only).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "ABC International School",
  "slug": "abc-school",
  "email": "info@abcschool.com",
  "phone": "+911234567890",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "postalCode": "400001",
  "board": "CBSE",
  "establishedYear": 2010,
  "subscriptionPlan": "premium",
  "maxStudents": 500,
  "maxTeachers": 50
}
```

**Response:** `201 Created`

### GET /schools
List all schools (Super Admin only).

**Headers:** `Authorization: Bearer {token}`

**Query Params:** page, limit, search

**Response:** `200 OK`

### GET /schools/:id
Get school details.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "ABC International School",
  "slug": "abc-school",
  "email": "info@abcschool.com",
  "phone": "+911234567890",
  "address": "123 Main St",
  "city": "Mumbai",
  "logoUrl": "https://...",
  "board": "CBSE",
  "subscriptionStatus": "active",
  "subscriptionPlan": "premium",
  "maxStudents": 500,
  "maxTeachers": 50,
  "currentStudents": 350,
  "currentTeachers": 35
}
```

### PUT /schools/:id
Update school (Admin only).

**Headers:** `Authorization: Bearer {token}`

**Body:** Same as create

**Response:** `200 OK`

### DELETE /schools/:id
Delete school (Super Admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

### GET /schools/:id/stats
Get school statistics.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "totalStudents": 350,
  "totalTeachers": 35,
  "totalClasses": 12,
  "attendanceToday": {
    "present": 330,
    "absent": 20
  },
  "pendingFees": 500000,
  "upcomingExams": 3
}
```

---

## Academic Year Endpoints

### POST /academic-years
Create academic year.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "name": "2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "isCurrent": true
}
```

**Response:** `201 Created`

### GET /academic-years
List academic years.

**Headers:** `Authorization: Bearer {token}`

**Query Params:** schoolId

**Response:** `200 OK`

### GET /academic-years/:id
Get academic year details.

**Response:** `200 OK`

### PUT /academic-years/:id
Update academic year.

**Response:** `200 OK`

### DELETE /academic-years/:id
Delete academic year.

**Response:** `204 No Content`

---

## Class Endpoints

### POST /classes
Create a class.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "name": "Class 10A",
  "gradeLevel": 10,
  "section": "A",
  "classTeacherId": "uuid",
  "roomNumber": "101",
  "maxStudents": 40
}
```

**Response:** `201 Created`

### GET /classes
List classes.

**Headers:** `Authorization: Bearer {token}`

**Query Params:** schoolId, academicYearId, gradeLevel

**Response:** `200 OK`

### GET /classes/:id
Get class details with enrolled students.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Class 10A",
  "gradeLevel": 10,
  "section": "A",
  "classTeacher": {
    "id": "uuid",
    "name": "Mr. Smith"
  },
  "roomNumber": "101",
  "maxStudents": 40,
  "currentStudents": 35,
  "students": [...]
}
```

### PUT /classes/:id
Update class.

**Response:** `200 OK`

### DELETE /classes/:id
Delete class.

**Response:** `204 No Content`

---

## Subject Endpoints

### POST /subjects
Create a subject.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "name": "Mathematics",
  "code": "MATH101",
  "description": "Advanced Mathematics",
  "gradeLevel": 10
}
```

**Response:** `201 Created`

### GET /subjects
List subjects.

**Query Params:** schoolId, gradeLevel

**Response:** `200 OK`

### GET /subjects/:id
Get subject details.

**Response:** `200 OK`

### PUT /subjects/:id
Update subject.

**Response:** `200 OK`

### DELETE /subjects/:id
Delete subject.

**Response:** `204 No Content`

---

## Student Endpoints

### POST /students
Create a student profile.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "userId": "uuid",
  "schoolId": "uuid",
  "admissionNumber": "2024001",
  "admissionDate": "2024-04-01",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "bloodGroup": "O+",
  "address": "123 Street",
  "parentId": "uuid",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+911234567890",
  "emergencyContactRelation": "Mother"
}
```

**Response:** `201 Created`

### GET /students
List students.

**Query Params:** schoolId, classId, search, page, limit

**Response:** `200 OK`

### GET /students/:id
Get student details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "admissionNumber": "2024001",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "bloodGroup": "O+",
  "currentClass": {
    "id": "uuid",
    "name": "Class 10A"
  },
  "parent": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+911234567890"
  },
  "status": "active"
}
```

### PUT /students/:id
Update student.

**Response:** `200 OK`

### DELETE /students/:id
Delete student.

**Response:** `204 No Content`

### GET /students/:id/report-card
Get student report card.

**Query Params:** examId, academicYearId

**Response:** `200 OK` (with PDF generation option)

---

## Teacher Endpoints

### POST /teachers
Create a teacher profile.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "userId": "uuid",
  "schoolId": "uuid",
  "employeeId": "EMP001",
  "joiningDate": "2020-06-01",
  "dateOfBirth": "1985-03-20",
  "gender": "female",
  "qualification": "M.Sc. Mathematics",
  "specialization": "Advanced Mathematics",
  "experienceYears": 10
}
```

**Response:** `201 Created`

### GET /teachers
List teachers.

**Query Params:** schoolId, search, page, limit

**Response:** `200 OK`

### GET /teachers/:id
Get teacher details.

**Response:** `200 OK`

### PUT /teachers/:id
Update teacher.

**Response:** `200 OK`

### DELETE /teachers/:id
Delete teacher.

**Response:** `204 No Content`

---

## Enrollment Endpoints

### POST /enrollments
Enroll a student in a class.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "studentId": "uuid",
  "classId": "uuid",
  "academicYearId": "uuid",
  "rollNumber": 15,
  "enrollmentDate": "2024-04-01"
}
```

**Response:** `201 Created`

### GET /enrollments
List enrollments.

**Query Params:** studentId, classId, academicYearId

**Response:** `200 OK`

### DELETE /enrollments/:id
Remove enrollment.

**Response:** `204 No Content`

---

## Course Endpoints

### POST /courses
Create a course.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "subjectId": "uuid",
  "classId": "uuid",
  "teacherId": "uuid",
  "title": "Introduction to Algebra",
  "description": "Basic algebra concepts",
  "objectives": ["Understand variables", "Solve equations"],
  "durationMinutes": 60,
  "difficultyLevel": "beginner",
  "status": "published"
}
```

**Response:** `201 Created`

### GET /courses
List courses.

**Query Params:** schoolId, classId, subjectId, teacherId

**Response:** `200 OK`

### GET /courses/:id
Get course details with materials.

**Response:** `200 OK`

### PUT /courses/:id
Update course.

**Response:** `200 OK`

### DELETE /courses/:id
Delete course.

**Response:** `204 No Content`

---

## Course Material Endpoints

### POST /courses/:courseId/materials
Add material to course.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "title": "Chapter 1 Video",
  "description": "Introduction video",
  "type": "video",
  "contentUrl": "https://...",
  "durationMinutes": 30,
  "orderIndex": 1,
  "isDownloadable": true
}
```

**Response:** `201 Created`

### GET /courses/:courseId/materials
List course materials.

**Response:** `200 OK`

### PUT /materials/:id
Update material.

**Response:** `200 OK`

### DELETE /materials/:id
Delete material.

**Response:** `204 No Content`

---

## Homework Endpoints

### POST /homework
Create homework assignment.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "classId": "uuid",
  "subjectId": "uuid",
  "teacherId": "uuid",
  "title": "Algebra Practice Problems",
  "description": "Solve the following problems",
  "instructions": "Show all work",
  "dueDate": "2024-12-30T23:59:59Z",
  "maxMarks": 100,
  "allowLateSubmission": false,
  "submissionType": ["text", "image", "pdf", "drawing"],
  "attachments": [
    {
      "name": "problem_set.pdf",
      "url": "https://..."
    }
  ]
}
```

**Response:** `201 Created`

### GET /homework
List homework assignments.

**Query Params:** schoolId, classId, subjectId, teacherId, studentId

**Response:** `200 OK`

### GET /homework/:id
Get homework details.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Algebra Practice Problems",
  "description": "Solve the following problems",
  "instructions": "Show all work",
  "dueDate": "2024-12-30T23:59:59Z",
  "maxMarks": 100,
  "class": {
    "id": "uuid",
    "name": "Class 10A"
  },
  "subject": {
    "id": "uuid",
    "name": "Mathematics"
  },
  "teacher": {
    "id": "uuid",
    "name": "Mr. Smith"
  },
  "submissionStats": {
    "total": 35,
    "submitted": 28,
    "pending": 7,
    "graded": 20
  }
}
```

### PUT /homework/:id
Update homework.

**Response:** `200 OK`

### DELETE /homework/:id
Delete homework.

**Response:** `204 No Content`

---

## Homework Submission Endpoints

### POST /homework/:homeworkId/submit
Submit homework (Student only).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "submissionText": "Here are my answers...",
  "submissionFiles": [
    {
      "name": "solution.pdf",
      "url": "https://..."
    }
  ],
  "drawingData": "<svg>...</svg>"
}
```

**Response:** `201 Created`

### GET /homework/:homeworkId/submissions
List homework submissions (Teacher only).

**Response:** `200 OK`

### GET /submissions/:id
Get submission details.

**Response:** `200 OK`

### PUT /submissions/:id/grade
Grade submission (Teacher only).

**Body:**
```json
{
  "marksObtained": 85,
  "feedback": "Good work! Watch for calculation errors."
}
```

**Response:** `200 OK`

### PUT /submissions/:id
Update submission (Student only, before due date).

**Response:** `200 OK`

---

## Exam Endpoints

### POST /exams
Create exam.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "name": "Mid-Term Examination",
  "examType": "mid_term",
  "startDate": "2024-10-01",
  "endDate": "2024-10-15",
  "description": "First semester mid-term exams"
}
```

**Response:** `201 Created`

### GET /exams
List exams.

**Query Params:** schoolId, academicYearId, examType

**Response:** `200 OK`

### GET /exams/:id
Get exam details with schedule.

**Response:** `200 OK`

### PUT /exams/:id
Update exam.

**Response:** `200 OK`

### DELETE /exams/:id
Delete exam.

**Response:** `204 No Content`

---

## Exam Schedule Endpoints

### POST /exams/:examId/schedule
Add exam schedule entry.

**Body:**
```json
{
  "classId": "uuid",
  "subjectId": "uuid",
  "examDate": "2024-10-05",
  "startTime": "09:00",
  "endTime": "12:00",
  "roomNumber": "Hall A",
  "maxMarks": 100,
  "minPassingMarks": 40
}
```

**Response:** `201 Created`

### GET /exams/:examId/schedule
Get exam schedule.

**Response:** `200 OK`

### PUT /exam-schedules/:id
Update schedule entry.

**Response:** `200 OK`

### DELETE /exam-schedules/:id
Delete schedule entry.

**Response:** `204 No Content`

---

## Grades Endpoints

### POST /grades
Enter student grade.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "examScheduleId": "uuid",
  "studentId": "uuid",
  "marksObtained": 85,
  "isAbsent": false,
  "remarks": "Good performance"
}
```

**Response:** `201 Created`

### POST /grades/bulk
Bulk grade entry.

**Body:**
```json
{
  "examScheduleId": "uuid",
  "grades": [
    {
      "studentId": "uuid",
      "marksObtained": 85,
      "isAbsent": false
    },
    {
      "studentId": "uuid",
      "marksObtained": 0,
      "isAbsent": true
    }
  ]
}
```

**Response:** `201 Created`

### GET /grades
List grades.

**Query Params:** examId, classId, studentId, subjectId

**Response:** `200 OK`

### PUT /grades/:id
Update grade.

**Response:** `200 OK`

### DELETE /grades/:id
Delete grade.

**Response:** `204 No Content`

---

## Attendance Endpoints

### POST /attendance
Mark attendance.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "classId": "uuid",
  "studentId": "uuid",
  "date": "2024-12-20",
  "status": "present",
  "remarks": ""
}
```

**Response:** `201 Created`

### POST /attendance/bulk
Bulk attendance marking.

**Body:**
```json
{
  "schoolId": "uuid",
  "classId": "uuid",
  "date": "2024-12-20",
  "attendance": [
    {
      "studentId": "uuid",
      "status": "present"
    },
    {
      "studentId": "uuid",
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

**Response:** `201 Created`

### GET /attendance
Get attendance records.

**Query Params:** schoolId, classId, studentId, startDate, endDate

**Response:** `200 OK`

### GET /attendance/report
Get attendance report.

**Query Params:** classId, studentId, month, year

**Response:** `200 OK`
```json
{
  "student": {
    "id": "uuid",
    "name": "John Doe"
  },
  "period": "2024-12",
  "totalDays": 20,
  "present": 18,
  "absent": 2,
  "late": 0,
  "attendancePercentage": 90,
  "details": [...]
}
```

### PUT /attendance/:id
Update attendance.

**Response:** `200 OK`

---

## Timetable Endpoints

### POST /timetable
Create timetable entry.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "classId": "uuid",
  "subjectId": "uuid",
  "teacherId": "uuid",
  "academicYearId": "uuid",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00",
  "roomNumber": "101"
}
```

**Response:** `201 Created`

### GET /timetable
Get timetable.

**Query Params:** schoolId, classId, teacherId, dayOfWeek

**Response:** `200 OK`

### PUT /timetable/:id
Update timetable entry.

**Response:** `200 OK`

### DELETE /timetable/:id
Delete timetable entry.

**Response:** `204 No Content`

---

## Fee Endpoints

### POST /fee-structures
Create fee structure.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "classId": "uuid",
  "name": "Tuition Fee",
  "description": "Annual tuition fee",
  "amount": 50000,
  "frequency": "annually",
  "dueDate": "2024-04-15",
  "isMandatory": true
}
```

**Response:** `201 Created`

### GET /fee-structures
List fee structures.

**Query Params:** schoolId, academicYearId, classId

**Response:** `200 OK`

### POST /student-fees
Assign fee to student.

**Body:**
```json
{
  "studentId": "uuid",
  "feeStructureId": "uuid",
  "amountDue": 50000,
  "discount": 5000,
  "dueDate": "2024-04-15"
}
```

**Response:** `201 Created`

### GET /student-fees
Get student fees.

**Query Params:** studentId, status

**Response:** `200 OK`

### GET /student-fees/:studentId/summary
Get fee summary for student.

**Response:** `200 OK`
```json
{
  "totalDue": 50000,
  "totalPaid": 30000,
  "totalDiscount": 5000,
  "balance": 15000,
  "fees": [...]
}
```

---

## Payment Endpoints

### POST /payments/create-order
Create Razorpay order.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "paymentType": "student_fee",
  "amount": 15000,
  "studentFeeIds": ["uuid1", "uuid2"],
  "metadata": {}
}
```

**Response:** `200 OK`
```json
{
  "orderId": "order_razorpay_id",
  "amount": 15000,
  "currency": "INR",
  "key": "razorpay_key"
}
```

### POST /payments/verify
Verify Razorpay payment.

**Body:**
```json
{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature"
}
```

**Response:** `200 OK`

### POST /payments/webhook
Razorpay webhook endpoint.

**Body:** Razorpay webhook payload

**Response:** `200 OK`

### GET /payments
List payments.

**Query Params:** schoolId, payerId, status, startDate, endDate

**Response:** `200 OK`

### GET /payments/:id
Get payment details.

**Response:** `200 OK`

### GET /payments/:id/receipt
Download payment receipt (PDF).

**Response:** `200 OK` (PDF file)

---

## Notification Endpoints

### GET /notifications
Get user notifications.

**Headers:** `Authorization: Bearer {token}`

**Query Params:** page, limit, isRead, type

**Response:** `200 OK`

### GET /notifications/unread-count
Get unread notification count.

**Response:** `200 OK`
```json
{
  "count": 5
}
```

### PUT /notifications/:id/read
Mark notification as read.

**Response:** `200 OK`

### PUT /notifications/read-all
Mark all notifications as read.

**Response:** `200 OK`

### DELETE /notifications/:id
Delete notification.

**Response:** `204 No Content`

---

## Announcement Endpoints

### POST /announcements
Create announcement.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "schoolId": "uuid",
  "title": "School Holiday Notification",
  "content": "School will be closed on...",
  "targetAudience": "all",
  "classId": null,
  "priority": "high",
  "isPublished": true,
  "expiresAt": "2024-12-31T23:59:59Z",
  "attachments": []
}
```

**Response:** `201 Created`

### GET /announcements
List announcements.

**Query Params:** schoolId, targetAudience, classId, isPublished

**Response:** `200 OK`

### GET /announcements/:id
Get announcement details.

**Response:** `200 OK`

### PUT /announcements/:id
Update announcement.

**Response:** `200 OK`

### DELETE /announcements/:id
Delete announcement.

**Response:** `204 No Content`

---

## Quiz Endpoints

### POST /quizzes
Create quiz.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "courseId": "uuid",
  "schoolId": "uuid",
  "classId": "uuid",
  "subjectId": "uuid",
  "teacherId": "uuid",
  "title": "Algebra Quiz 1",
  "description": "Test your algebra skills",
  "durationMinutes": 30,
  "totalMarks": 50,
  "passingMarks": 25,
  "startTime": "2024-12-25T10:00:00Z",
  "endTime": "2024-12-25T12:00:00Z",
  "isPublished": true,
  "shuffleQuestions": true,
  "showResults": true
}
```

**Response:** `201 Created`

### GET /quizzes
List quizzes.

**Query Params:** courseId, classId, subjectId

**Response:** `200 OK`

### GET /quizzes/:id
Get quiz details.

**Response:** `200 OK`

### PUT /quizzes/:id
Update quiz.

**Response:** `200 OK`

### DELETE /quizzes/:id
Delete quiz.

**Response:** `204 No Content`

---

## Quiz Question Endpoints

### POST /quizzes/:quizId/questions
Add question to quiz.

**Body:**
```json
{
  "questionText": "What is 2 + 2?",
  "questionType": "mcq",
  "options": [
    {"label": "A", "text": "3"},
    {"label": "B", "text": "4"},
    {"label": "C", "text": "5"}
  ],
  "correctAnswer": "B",
  "marks": 2,
  "orderIndex": 1,
  "explanation": "Basic addition"
}
```

**Response:** `201 Created`

### GET /quizzes/:quizId/questions
Get quiz questions.

**Response:** `200 OK`

### PUT /questions/:id
Update question.

**Response:** `200 OK`

### DELETE /questions/:id
Delete question.

**Response:** `204 No Content`

---

## Quiz Attempt Endpoints

### POST /quizzes/:quizId/start
Start quiz attempt (Student only).

**Headers:** `Authorization: Bearer {token}`

**Response:** `201 Created`
```json
{
  "attemptId": "uuid",
  "startedAt": "2024-12-25T10:00:00Z",
  "expiresAt": "2024-12-25T10:30:00Z",
  "questions": [...]
}
```

### PUT /attempts/:attemptId/answer
Submit answer.

**Body:**
```json
{
  "questionId": "uuid",
  "answer": "B"
}
```

**Response:** `200 OK`

### POST /attempts/:attemptId/submit
Submit quiz.

**Response:** `200 OK`
```json
{
  "score": 45,
  "totalMarks": 50,
  "percentage": 90,
  "passed": true
}
```

### GET /attempts/:attemptId
Get attempt details.

**Response:** `200 OK`

---

## Admission Endpoints

### POST /admissions
Submit admission application.

**Body:**
```json
{
  "schoolId": "uuid",
  "academicYearId": "uuid",
  "classId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "email": "john@example.com",
  "phone": "+911234567890",
  "address": "123 Street",
  "parentName": "Jane Doe",
  "parentEmail": "jane@example.com",
  "parentPhone": "+919876543210",
  "previousSchool": "XYZ School",
  "documents": []
}
```

**Response:** `201 Created`

### GET /admissions
List admission applications.

**Query Params:** schoolId, status, academicYearId

**Response:** `200 OK`

### GET /admissions/:id
Get admission details.

**Response:** `200 OK`

### PUT /admissions/:id/review
Review admission application.

**Body:**
```json
{
  "status": "approved",
  "remarks": "Approved for admission"
}
```

**Response:** `200 OK`

### DELETE /admissions/:id
Delete admission application.

**Response:** `204 No Content`

---

## File Upload Endpoints

### POST /upload/file
Upload a file (image, PDF, document).

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body:** FormData with `file` field

**Response:** `200 OK`
```json
{
  "url": "https://storage.../file.pdf",
  "name": "file.pdf",
  "size": 102400,
  "type": "application/pdf"
}
```

### POST /upload/image
Upload an image with optimization.

**Response:** `200 OK`
```json
{
  "url": "https://storage.../image.jpg",
  "thumbnailUrl": "https://storage.../thumb_image.jpg",
  "name": "image.jpg",
  "size": 51200,
  "width": 1920,
  "height": 1080
}
```

---

## Report Endpoints

### GET /reports/student/:studentId
Get comprehensive student report.

**Query Params:** academicYearId

**Response:** `200 OK` (JSON or PDF)

### GET /reports/class/:classId/performance
Get class performance report.

**Query Params:** examId, subjectId

**Response:** `200 OK`

### GET /reports/attendance
Get attendance report.

**Query Params:** schoolId, classId, startDate, endDate

**Response:** `200 OK`

### GET /reports/fees
Get fees collection report.

**Query Params:** schoolId, startDate, endDate

**Response:** `200 OK`

---

## Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics based on user role.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "role": "teacher",
  "stats": {
    "myClasses": 5,
    "totalStudents": 150,
    "pendingHomework": 12,
    "upcomingExams": 2
  }
}
```

### GET /dashboard/recent-activity
Get recent activity feed.

**Response:** `200 OK`

---

## WebSocket Events

### Connection
```
ws://api.schoolos.com/ws?token={jwt_token}
```

### Events

#### Client → Server
- `join_room`: Join specific room (class, school)
- `leave_room`: Leave room
- `mark_notification_read`: Mark notification as read

#### Server → Client
- `notification`: New notification
- `announcement`: New announcement
- `homework_assigned`: New homework assigned
- `grade_published`: Grade published
- `attendance_marked`: Attendance marked
- `exam_scheduled`: Exam scheduled
- `payment_received`: Payment received

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request",
  "details": []
}
```

### Common Status Codes
- `200 OK`: Success
- `201 Created`: Resource created
- `204 No Content`: Success with no response body
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authenticated: 1000 requests per 15 minutes per user
- Headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

All list endpoints support pagination:

**Query Params:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```
