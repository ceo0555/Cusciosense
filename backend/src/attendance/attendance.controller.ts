import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post(':classId')
  markAttendance(
    @Param('classId') classId: string,
    @Body() data: { date: string; attendance: any[] },
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.markAttendance(classId, new Date(data.date), data.attendance, user.id);
  }

  @Get(':classId')
  getAttendance(
    @Param('classId') classId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getAttendance(classId, new Date(startDate), new Date(endDate));
  }

  @Get('student/:studentId')
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, new Date(startDate), new Date(endDate));
  }
}
