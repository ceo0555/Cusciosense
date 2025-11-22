import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles('SCHOOL_ADMIN')
  create(@Body() data: any) {
    return this.staffService.create(data);
  }

  @Get()
  @Roles('SCHOOL_ADMIN', 'TEACHER')
  findAll(@Query() query: any) {
    return this.staffService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @Roles('SCHOOL_ADMIN')
  update(@Param('id') id: string, @Body() data: any) {
    return this.staffService.update(id, data);
  }
}
