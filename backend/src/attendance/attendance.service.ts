import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markAttendance(classId: string, date: Date, attendance: any[], markedBy: string) {
    const records = attendance.map(record => ({
      classId,
      studentId: record.studentId,
      date,
      status: record.status,
      remarks: record.remarks,
      markedBy,
    }));

    return this.prisma.attendance.createMany({ data: records, skipDuplicates: true });
  }

  async getAttendance(classId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: { classId, date: { gte: startDate, lte: endDate } },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async getStudentAttendance(studentId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: { studentId, date: { gte: startDate, lte: endDate } },
    });
  }
}
