import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  async createStructure(schoolId: string, data: any) {
    return this.prisma.feeStructure.create({ data: { ...data, schoolId } });
  }

  async getFeeStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({ where: { schoolId } });
  }

  async getStudentFees(studentId: string) {
    const payments = await this.prisma.feePayment.findMany({
      where: { studentId },
      include: { feeStructure: true },
    });
    return payments;
  }

  async createPayment(data: any) {
    return this.prisma.feePayment.create({ data });
  }
}
