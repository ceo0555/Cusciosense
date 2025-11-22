import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  markAttendance(@Body() data: any, @CurrentUser() user: any) {
    return this.attendanceService.markAttendance(data, user.id);
  }

  @Get()
  getAttendance(@Query() query: any) {
    return this.attendanceService.getAttendance(query);
  }

  @Get('summary')
  getSummary(@Query() query: any) {
    return this.attendanceService.getSummary(query);
  }
}
