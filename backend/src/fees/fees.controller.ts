import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Fees')
@ApiBearerAuth()
@Controller('fees')
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('structures')
  createStructure(@Body() data: any) {
    return this.feesService.createStructure(data.schoolId, data);
  }

  @Get('structures')
  getFeeStructures(@Query('schoolId') schoolId: string) {
    return this.feesService.getFeeStructures(schoolId);
  }

  @Get('student/:studentId')
  getStudentFees(@Param('studentId') studentId: string) {
    return this.feesService.getStudentFees(studentId);
  }

  @Post('payments')
  createPayment(@Body() data: any) {
    return this.feesService.createPayment(data);
  }
}
