import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
// import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  // private razorpay: Razorpay;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize Razorpay
    // this.razorpay = new Razorpay({
    //   key_id: this.configService.get('RAZORPAY_KEY_ID'),
    //   key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    // });
  }

  async createSubscription(schoolId: string, data: any) {
    const planAmounts = {
      FREE: 0,
      BASIC: 10000,
      PREMIUM: 50000,
      ENTERPRISE: 100000,
    };

    const amount = planAmounts[data.plan] || 0;

    // Create Razorpay order
    // const order = await this.razorpay.orders.create({
    //   amount: amount * 100, // Convert to paise
    //   currency: 'INR',
    //   receipt: `sub_${Date.now()}`,
    // });

    const subscription = await this.prisma.subscription.create({
      data: {
        schoolId,
        plan: data.plan,
        billingCycle: data.billingCycle,
        amount,
        startDate: new Date(),
        endDate: this.calculateEndDate(data.billingCycle),
        status: 'ACTIVE',
      },
    });

    return {
      subscription,
      // razorpayOrderId: order.id,
      razorpayOrderId: `order_${Date.now()}`, // Mock for now
    };
  }

  async verifyPayment(subscriptionId: string, paymentData: any) {
    // Verify Razorpay signature
    // const isValid = this.verifyRazorpaySignature(paymentData);

    // For now, assume valid
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId,
        schoolId: paymentData.schoolId,
        amount: paymentData.amount,
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpaySignature: paymentData.razorpaySignature,
        status: 'SUCCESS',
        paymentDate: new Date(),
      },
    });

    // Update subscription status
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'ACTIVE' },
    });

    return { status: 'SUCCESS', payment };
  }

  async getSubscriptions(schoolId: string) {
    return this.prisma.subscription.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private calculateEndDate(billingCycle: string): Date {
    const now = new Date();
    switch (billingCycle) {
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'QUARTERLY':
        return new Date(now.setMonth(now.getMonth() + 3));
      case 'YEARLY':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return new Date(now.setMonth(now.getMonth() + 1));
    }
  }
}
