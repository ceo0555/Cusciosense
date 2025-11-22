import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { ClassesModule } from './classes/classes.module';
import { CoursesModule } from './courses/courses.module';
import { HomeworkModule } from './homework/homework.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';
import { StaffModule } from './staff/staff.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { FeesModule } from './fees/fees.module';
import { ExamsModule } from './exams/exams.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassesModule,
    CoursesModule,
    HomeworkModule,
    QuizzesModule,
    AttendanceModule,
    TimetableModule,
    StaffModule,
    AdmissionsModule,
    FeesModule,
    ExamsModule,
    ReportsModule,
    NotificationsModule,
    AnnouncementsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
