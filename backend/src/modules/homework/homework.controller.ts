import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  createHomework(@Body() data: any, @CurrentUser() user: any) {
    return this.homeworkService.createHomework(data, user.id);
  }

  @Get()
  getHomework(@Query() query: any) {
    return this.homeworkService.getHomework(query);
  }

  @Get(':id')
  getHomeworkById(@Param('id') id: string) {
    return this.homeworkService.getHomeworkById(id);
  }

  @Post(':id/submit')
  @Roles('STUDENT')
  submitHomework(
    @Param('id') homeworkId: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    // Note: In real implementation, we need to get studentId from user.id
    return this.homeworkService.submitHomework(homeworkId, data.studentId, data);
  }

  @Get(':id/submissions')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  getSubmissions(@Param('id') homeworkId: string) {
    return this.homeworkService.getSubmissions(homeworkId);
  }

  @Patch('submissions/:id/grade')
  @Roles('TEACHER')
  gradeSubmission(
    @Param('id') submissionId: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    return this.homeworkService.gradeSubmission(submissionId, data, user.id);
  }
}
