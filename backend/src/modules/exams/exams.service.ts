import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async createExam(data: any) {
    return this.prisma.exam.create({ data });
  }

  async getExams(schoolId: string) {
    return this.prisma.exam.findMany({
      where: { schoolId },
      include: { academicYear: true, schedules: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async createSchedule(examId: string, data: any) {
    return this.prisma.examSchedule.create({
      data: { ...data, examId },
    });
  }

  async getSchedules(examId: string, sectionId?: string) {
    return this.prisma.examSchedule.findMany({
      where: {
        examId,
        ...(sectionId && { sectionId }),
      },
      include: { subject: true, section: true },
    });
  }

  async enterResults(examScheduleId: string, results: any[], enteredById: string) {
    const records = results.map(r => ({
      examScheduleId,
      studentId: r.studentId,
      marksObtained: r.marksObtained,
      grade: r.grade,
      remarks: r.remarks,
      enteredById,
    }));

    await Promise.all(
      records.map(record =>
        this.prisma.examResult.upsert({
          where: {
            examScheduleId_studentId: {
              examScheduleId: record.examScheduleId,
              studentId: record.studentId,
            },
          },
          update: record,
          create: record,
        }),
      ),
    );

    return { message: 'Results entered successfully', count: records.length };
  }

  async getResults(filters: any) {
    const { examId, studentId, sectionId } = filters;
    
    return this.prisma.examResult.findMany({
      where: {
        ...(studentId && { studentId }),
        examSchedule: {
          ...(examId && { examId }),
          ...(sectionId && { sectionId }),
        },
      },
      include: {
        student: { include: { user: true } },
        examSchedule: { include: { subject: true } },
      },
    });
  }

  async generateReportCard(studentId: string, examId: string) {
    const results = await this.getResults({ studentId, examId });
    
    const totalMarksObtained = results.reduce(
      (sum, r) => sum + Number(r.marksObtained),
      0,
    );
    const totalMaxMarks = results.reduce(
      (sum, r) => sum + r.examSchedule.maxMarks,
      0,
    );
    const percentage = (totalMarksObtained / totalMaxMarks) * 100;
    const grade = this.calculateGrade(percentage);

    // Get attendance
    const attendance = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: { studentId },
      _count: true,
    });

    const attendanceTotal = attendance.reduce((sum, a) => sum + a._count, 0);
    const attendancePresent = attendance.find(a => a.status === 'PRESENT')?._count || 0;
    const attendancePercentage = (attendancePresent / attendanceTotal) * 100;

    return this.prisma.reportCard.create({
      data: {
        studentId,
        examId,
        totalMarksObtained,
        totalMaxMarks,
        percentage,
        grade,
        attendancePercentage,
        generatedAt: new Date(),
      },
    });
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }
}
