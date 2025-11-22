import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async create(classSubjectId: string, teacherId: string, data: any) {
    return this.prisma.homework.create({
      data: {
        ...data,
        classSubjectId,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(classSubjectId: string) {
    return this.prisma.homework.findMany({
      where: { classSubjectId },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: {
        teacher: true,
        attachments: true,
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
            attachments: true,
          },
        },
      },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return homework;
  }

  async submitHomework(homeworkId: string, studentId: string, data: any) {
    return this.prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: {
          homeworkId,
          studentId,
        },
      },
      update: {
        ...data,
        submittedAt: new Date(),
      },
      create: {
        homeworkId,
        studentId,
        ...data,
      },
    });
  }

  async gradeSubmission(submissionId: string, gradedBy: string, data: any) {
    return this.prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        ...data,
        gradedBy,
        gradedAt: new Date(),
        status: 'GRADED',
      },
    });
  }

  async getMySubmission(homeworkId: string, studentId: string) {
    return this.prisma.homeworkSubmission.findUnique({
      where: {
        homeworkId_studentId: {
          homeworkId,
          studentId,
        },
      },
      include: {
        attachments: true,
      },
    });
  }
}
