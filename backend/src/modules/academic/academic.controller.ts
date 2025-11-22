import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // Academic Years
  @Post('academic-years')
  @Roles('SCHOOL_ADMIN')
  createAcademicYear(@Body() data: any) {
    return this.academicService.createAcademicYear(data);
  }

  @Get('academic-years')
  getAcademicYears(@Query('schoolId') schoolId: string) {
    return this.academicService.getAcademicYears(schoolId);
  }

  // Classes
  @Post('classes')
  @Roles('SCHOOL_ADMIN')
  createClass(@Body() data: any) {
    return this.academicService.createClass(data);
  }

  @Get('classes')
  getClasses(@Query() query: any) {
    return this.academicService.getClasses(query.schoolId, query.academicYearId);
  }

  // Sections
  @Post('sections')
  @Roles('SCHOOL_ADMIN')
  createSection(@Body() data: any) {
    return this.academicService.createSection(data);
  }

  @Get('sections')
  getSections(@Query('classId') classId: string) {
    return this.academicService.getSections(classId);
  }

  // Subjects
  @Post('subjects')
  @Roles('SCHOOL_ADMIN')
  createSubject(@Body() data: any) {
    return this.academicService.createSubject(data);
  }

  @Get('subjects')
  getSubjects(@Query() query: any) {
    return this.academicService.getSubjects(query);
  }

  // Timetable
  @Post('timetables')
  @Roles('SCHOOL_ADMIN', 'TEACHER')
  createTimetable(@Body() data: any) {
    return this.academicService.createTimetable(data);
  }

  @Get('timetables')
  getTimetable(@Query() query: any) {
    return this.academicService.getTimetable(query.sectionId, query.dayOfWeek);
  }
}
