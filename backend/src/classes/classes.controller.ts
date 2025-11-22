import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Classes')
@ApiBearerAuth()
@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  create(@Body() data: any) {
    return this.classesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  findAll(@Query() filters: any) {
    return this.classesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update class' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.classesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class' })
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  @Post(':id/students')
  @ApiOperation({ summary: 'Enroll student in class' })
  enrollStudent(
    @Param('id') id: string,
    @Body() data: { studentId: string; rollNumber?: string },
  ) {
    return this.classesService.enrollStudent(id, data.studentId, data.rollNumber);
  }
}
