import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { LmsService } from './lms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Post('courses')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  createCourse(@Body() data: any, @CurrentUser() user: any) {
    return this.lmsService.createCourse(data, user.id);
  }

  @Get('courses')
  getCourses(@Query() query: any) {
    return this.lmsService.getCourses(query);
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.lmsService.getCourse(id);
  }

  @Patch('courses/:id')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  updateCourse(@Param('id') id: string, @Body() data: any) {
    return this.lmsService.updateCourse(id, data);
  }

  @Post('courses/:id/content')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  addContent(@Param('id') courseId: string, @Body() data: any) {
    return this.lmsService.addContent(courseId, data);
  }

  @Get('courses/:id/content')
  getContent(@Param('id') courseId: string) {
    return this.lmsService.getContent(courseId);
  }

  @Patch('content/:id')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  updateContent(@Param('id') id: string, @Body() data: any) {
    return this.lmsService.updateContent(id, data);
  }

  @Delete('content/:id')
  @Roles('TEACHER', 'SCHOOL_ADMIN')
  deleteContent(@Param('id') id: string) {
    return this.lmsService.deleteContent(id);
  }
}
