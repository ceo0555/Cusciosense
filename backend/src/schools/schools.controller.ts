import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Schools')
@ApiBearerAuth()
@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new school' })
  create(@Body() data: any) {
    return this.schoolsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  findAll(@Query() filters: any) {
    return this.schoolsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school by ID' })
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Update school' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.schoolsService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete school' })
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }

  @Post(':schoolId/users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Add user to school' })
  addUser(
    @Param('schoolId') schoolId: string,
    @Body() data: { userId: string; role: UserRole },
  ) {
    return this.schoolsService.addUser(schoolId, data.userId, data.role);
  }
}
