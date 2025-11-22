import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Homework')
@ApiBearerAuth()
@Controller('homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  @ApiOperation({ summary: 'Create homework' })
  create(@CurrentUser() user: any, @Body() data: any) {
    return this.homeworkService.create(data.classSubjectId, user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all homework for a subject' })
  findAll(@Query('classSubjectId') classSubjectId: string) {
    return this.homeworkService.findAll(classSubjectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get homework by ID' })
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit homework' })
  submit(@Param('id') id: string, @CurrentUser() user: any, @Body() data: any) {
    return this.homeworkService.submitHomework(id, user.id, data);
  }

  @Get(':id/my-submission')
  @ApiOperation({ summary: 'Get my homework submission' })
  getMySubmission(@Param('id') id: string, @CurrentUser() user: any) {
    return this.homeworkService.getMySubmission(id, user.id);
  }

  @Put('submissions/:id/grade')
  @ApiOperation({ summary: 'Grade homework submission' })
  gradeSubmission(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() data: any,
  ) {
    return this.homeworkService.gradeSubmission(id, user.id, data);
  }
}
