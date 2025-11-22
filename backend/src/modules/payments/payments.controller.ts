import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('SCHOOL_ADMIN')
  createSubscription(@Body() data: any) {
    return this.paymentsService.createSubscription(data.schoolId, data);
  }

  @Post(':id/verify-payment')
  @Roles('SCHOOL_ADMIN')
  verifyPayment(@Param('id') subscriptionId: string, @Body() paymentData: any) {
    return this.paymentsService.verifyPayment(subscriptionId, paymentData);
  }

  @Get()
  @Roles('SCHOOL_ADMIN', 'SUPER_ADMIN')
  getSubscriptions(@Query('schoolId') schoolId: string) {
    return this.paymentsService.getSubscriptions(schoolId);
  }
}
