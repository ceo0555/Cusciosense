import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('SCHOOL_ADMIN')
  create(@Body() data: any) {
    return this.studentsService.create(data);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get(':id/performance')
  getPerformance(@Param('id') id: string) {
    return this.studentsService.getPerformance(id);
  }

  @Patch(':id')
  @Roles('SCHOOL_ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.studentsService.update(id, data);
  }
}
