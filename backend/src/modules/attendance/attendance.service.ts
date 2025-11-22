import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markAttendance(data: any, markedById: string) {
    const { sectionId, date, attendance } = data;

    const records = attendance.map((record: any) => ({
      studentId: record.studentId,
      sectionId,
      date: new Date(date),
      status: record.status,
      remarks: record.remarks,
      markedById,
    }));

    // Upsert attendance records
    await Promise.all(
      records.map((record: any) =>
        this.prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: record.date,
            },
          },
          update: record,
          create: record,
        }),
      ),
    );

    return { message: 'Attendance marked successfully', count: records.length };
  }

  async getAttendance(filters: any) {
    const { sectionId, studentId, date, startDate, endDate } = filters;

    const where: any = {};
    if (sectionId) where.sectionId = sectionId;
    if (studentId) where.studentId = studentId;
    if (date) where.date = new Date(date);
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        student: { include: { user: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getSummary(filters: any) {
    const { studentId, sectionId, month, year } = filters;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (sectionId) where.sectionId = sectionId;
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      where.date = { gte: startDate, lte: endDate };
    }

    const records = await this.prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const total = records.reduce((sum, r) => sum + r._count, 0);
    const present = records.find(r => r.status === 'PRESENT')?._count || 0;

    return {
      total,
      present,
      absent: records.find(r => r.status === 'ABSENT')?._count || 0,
      late: records.find(r => r.status === 'LATE')?._count || 0,
      percentage: total > 0 ? (present / total) * 100 : 0,
    };
  }
}
