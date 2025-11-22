import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('exams')
  @Roles('SCHOOL_ADMIN')
  createExam(@Body() data: any) {
    return this.examsService.createExam(data);
  }

  @Get('exams')
  getExams(@Query('schoolId') schoolId: string) {
    return this.examsService.getExams(schoolId);
  }

  @Post('exams/:id/schedules')
  @Roles('SCHOOL_ADMIN')
  createSchedule(@Param('id') examId: string, @Body() data: any) {
    return this.examsService.createSchedule(examId, data);
  }

  @Get('exams/:id/schedules')
  getSchedules(@Param('id') examId: string, @Query('sectionId') sectionId?: string) {
    return this.examsService.getSchedules(examId, sectionId);
  }

  @Post('exam-results')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  enterResults(@Body() data: any, @CurrentUser() user: any) {
    return this.examsService.enterResults(data.examScheduleId, data.results, user.id);
  }

  @Get('exam-results')
  getResults(@Query() query: any) {
    return this.examsService.getResults(query);
  }

  @Post('report-cards/generate')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  generateReportCard(@Body() data: any) {
    return this.examsService.generateReportCard(data.studentId, data.examId);
  }
}
