import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Timetable')
@ApiBearerAuth()
@Controller('timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post(':classId')
  create(@Param('classId') classId: string, @Body() data: any) {
    return this.timetableService.create(classId, data);
  }

  @Get(':classId')
  findAll(@Param('classId') classId: string) {
    return this.timetableService.findAll(classId);
  }
}
