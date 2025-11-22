import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.student.create({
      data,
      include: { user: true, section: { include: { class: true } } },
    });
  }

  async findAll(filters: any) {
    const { schoolId, sectionId, status, page = 1, limit = 20 } = filters;
    
    const where: any = { schoolId };
    if (sectionId) where.sectionId = sectionId;
    if (status) where.status = status;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          section: { include: { class: true } },
          parent: true,
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return { data: students, total, page, limit };
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        section: { include: { class: true } },
        parent: true,
        school: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async getPerformance(studentId: string) {
    // Aggregate attendance, exam results, homework stats
    const [attendance, examResults, homework] = await Promise.all([
      this.prisma.attendance.groupBy({
        by: ['status'],
        where: { studentId },
        _count: true,
      }),
      this.prisma.examResult.findMany({
        where: { studentId },
        include: { examSchedule: { include: { subject: true } } },
      }),
      this.prisma.homeworkSubmission.findMany({
        where: { studentId },
        select: { marksObtained: true, status: true },
      }),
    ]);

    return {
      attendance: this.calculateAttendanceStats(attendance),
      examResults: this.calculateExamStats(examResults),
      homework: this.calculateHomeworkStats(homework),
    };
  }

  private calculateAttendanceStats(attendance: any[]) {
    const total = attendance.reduce((sum, a) => sum + a._count, 0);
    const present = attendance.find(a => a.status === 'PRESENT')?._count || 0;
    return {
      total,
      present,
      absent: attendance.find(a => a.status === 'ABSENT')?._count || 0,
      percentage: total > 0 ? (present / total) * 100 : 0,
    };
  }

  private calculateExamStats(results: any[]) {
    if (results.length === 0) return { averagePercentage: 0, totalExams: 0 };
    
    const totalPercentage = results.reduce((sum, r) => {
      const percentage = (Number(r.marksObtained) / r.examSchedule.maxMarks) * 100;
      return sum + percentage;
    }, 0);

    return {
      averagePercentage: totalPercentage / results.length,
      totalExams: results.length,
    };
  }

  private calculateHomeworkStats(homework: any[]) {
    const submitted = homework.filter(h => h.status === 'GRADED').length;
    const avgMarks = homework
      .filter(h => h.marksObtained)
      .reduce((sum, h) => sum + Number(h.marksObtained), 0) / submitted || 0;

    return {
      submitted,
      pending: homework.filter(h => h.status === 'PENDING').length,
      averageMarks: avgMarks,
    };
  }
}
