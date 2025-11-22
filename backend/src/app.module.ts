import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { AcademicModule } from './modules/academic/academic.module';
import { StaffModule } from './modules/staff/staff.module';
import { StudentsModule } from './modules/students/students.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LmsModule } from './modules/lms/lms.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ExamsModule } from './modules/exams/exams.module';
import { FeesModule } from './modules/fees/fees.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per TTL
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    AcademicModule,
    StaffModule,
    StudentsModule,
    AttendanceModule,
    LmsModule,
    HomeworkModule,
    QuizModule,
    ExamsModule,
    FeesModule,
    PaymentsModule,
    NotificationsModule,
    FileUploadModule,
  ],
})
export class AppModule {}
