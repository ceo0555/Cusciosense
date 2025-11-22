import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async createHomework(data: any, createdById: string) {
    return this.prisma.homework.create({
      data: { ...data, createdById },
      include: { subject: true, section: true },
    });
  }

  async getHomework(filters: any) {
    const { sectionId, subjectId, studentId } = filters;
    
    const where: any = {};
    if (sectionId) where.sectionId = sectionId;
    if (subjectId) where.subjectId = subjectId;

    const homework = await this.prisma.homework.findMany({
      where,
      include: {
        subject: true,
        section: true,
        ...(studentId && {
          submissions: {
            where: { studentId },
          },
        }),
      },
      orderBy: { dueDate: 'desc' },
    });

    return homework;
  }

  async getHomeworkById(id: string) {
    return this.prisma.homework.findUnique({
      where: { id },
      include: {
        subject: true,
        section: true,
        submissions: {
          include: { student: { include: { user: true } } },
        },
      },
    });
  }

  async submitHomework(homeworkId: string, studentId: string, data: any) {
    return this.prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        studentId,
        ...data,
        submittedAt: new Date(),
        status: 'SUBMITTED',
      },
    });
  }

  async getSubmissions(homeworkId: string) {
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: { student: { include: { user: true } } },
    });
  }

  async gradeSubmission(submissionId: string, data: any, gradedById: string) {
    return this.prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        ...data,
        gradedById,
        gradedAt: new Date(),
        status: 'GRADED',
      },
    });
  }
}
