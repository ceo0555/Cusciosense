import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { SchoolModule } from './modules/school/school.module'
import { StudentModule } from './modules/student/student.module'
import { TeacherModule } from './modules/teacher/teacher.module'
import { ClassModule } from './modules/class/class.module'
import { SubjectModule } from './modules/subject/subject.module'
import { CourseModule } from './modules/course/course.module'
import { HomeworkModule } from './modules/homework/homework.module'
import { ExamModule } from './modules/exam/exam.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { FeeModule } from './modules/fee/fee.module'
import { PaymentModule } from './modules/payment/payment.module'
import { NotificationModule } from './modules/notification/notification.module'
import { UploadModule } from './modules/upload/upload.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UserModule,
    SchoolModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    SubjectModule,
    CourseModule,
    HomeworkModule,
    ExamModule,
    AttendanceModule,
    FeeModule,
    PaymentModule,
    NotificationModule,
    UploadModule,
  ],
})
export class AppModule {}
