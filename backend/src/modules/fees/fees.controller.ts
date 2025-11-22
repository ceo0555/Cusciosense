import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('fee-structures')
  @Roles('SCHOOL_ADMIN')
  createFeeStructure(@Body() data: any) {
    return this.feesService.createFeeStructure(data);
  }

  @Get('fee-structures')
  getFeeStructures(@Query() query: any) {
    return this.feesService.getFeeStructures(query);
  }

  @Post('fee-payments')
  @Roles('SCHOOL_ADMIN', 'PARENT')
  recordPayment(@Body() data: any) {
    return this.feesService.recordPayment(data);
  }

  @Get('fee-payments')
  getPayments(@Query() query: any) {
    return this.feesService.getPayments(query);
  }
}
