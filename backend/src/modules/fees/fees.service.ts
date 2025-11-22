import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  async createFeeStructure(data: any) {
    return this.prisma.feeStructure.create({ data });
  }

  async getFeeStructures(filters: any) {
    const { schoolId, classId, academicYearId } = filters;
    
    return this.prisma.feeStructure.findMany({
      where: {
        ...(schoolId && { schoolId }),
        ...(classId && { classId }),
        ...(academicYearId && { academicYearId }),
      },
      include: { class: true, academicYear: true },
    });
  }

  async recordPayment(data: any) {
    const receiptNumber = `REC${Date.now()}`;
    
    return this.prisma.feePayment.create({
      data: {
        ...data,
        receiptNumber,
        paymentDate: data.paymentDate || new Date(),
      },
      include: { student: { include: { user: true } }, feeStructure: true },
    });
  }

  async getPayments(filters: any) {
    const { studentId, schoolId, status, page = 1, limit = 20 } = filters;
    
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.paymentStatus = status;
    if (schoolId) {
      where.student = { schoolId };
    }

    const [payments, total] = await Promise.all([
      this.prisma.feePayment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          student: { include: { user: true } },
          feeStructure: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.feePayment.count({ where }),
    ]);

    return { data: payments, total, page, limit };
  }
}
